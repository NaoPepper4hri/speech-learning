"""Server implementation for Grpc communication with Pepper."""
import logging
import uuid
from concurrent import futures
from datetime import datetime
from queue import Empty, Queue
from typing import AsyncIterable, Callable, Dict, Optional

import grpc
import pepper_command_pb2
import pepper_command_pb2_grpc
from google.protobuf import empty_pb2


class CommandBridge:
    """
    A GRPC command manager.

    All commands are added to a queue, which sends them off in order, and keeps track of the
    updates on each command.
    """

    def __init__(self) -> None:
        """Initialize the CommandBridge."""
        self.accepting_cmds = True
        self.pepper_tasks: Dict[str, str] = {}
        self._queue: Queue = Queue()
        self._on_clear_action: Optional[Callable] = None

    def stop(self) -> None:
        """Stop sending out commands."""
        self.accepting_cmds = False

    def send_command(self, cmd: str) -> None:
        """Add a new command to command queue."""
        self._queue.put(cmd)

    def is_pepper_done(self) -> bool:
        """Check if all commands have been executed in server."""
        return len(list(self.pepper_tasks.keys())) == 0

    def clear_queue(self) -> None:
        """Clear command queue."""
        try:
            while True:
                self._queue.get_nowait()
        except Empty:
            pass

    def set_clear_action(self, callback: Callable) -> None:
        """Set a callback to be run when an action has finished."""
        self._on_clear_action = callback

    def clear_action(self, uid: str) -> None:
        """Remove command with uid."""
        removed = self.pepper_tasks.pop(uid)
        if self._on_clear_action is not None:
            self._on_clear_action(removed)

    def get(self, timeout: float) -> pepper_command_pb2.Command:
        """Produce a new command from the queue."""
        # cmd = {
        #     "animation": {
        #         "name": "asdf",
        #         "halt_last": False,
        #     },
        #     "say": "ss",
        #     "goto": {"x": 0.0, "y": 0.0, "theta": 0.0},  # <- Radians
        #     "abilities": [
        #         {
        #             "ty": pepper_command_pb2.Command.AutonomousAbilities.Ability.BASIC_AWARENESS,
        #             "enabled": False,
        #         },
        #         {
        #             "ty": pepper_command_pb2.Command.AutonomousAbilities.Ability.BACKGROUND_MOVEMENT,
        #             "enabled": True,
        #         },
        #     ],
        # }
        cmd = self._queue.get(timeout=timeout)
        _uid = str(uuid.uuid1())
        self.pepper_tasks[_uid] = cmd

        message = pepper_command_pb2.Command()

        message.uuid = _uid

        if "animation" in cmd:
            message.animation.name = cmd["animation"].get("name", "")
            message.animation.halt_last = cmd["animation"].get("halt_last", "")

        if "say" in cmd:
            message.say = cmd["say"]

        if "goto" in cmd:
            message.goto.x = cmd["goto"].get("x", 0.0)
            message.goto.y = cmd["goto"].get("y", 0.0)
            message.goto.theta = cmd["goto"].get("theta", 0.0)

        if "abilities" in cmd:
            for ability in cmd["abilities"]:
                message.abilities.append(
                    pepper_command_pb2.Command.AutonomousAbilities(
                        ty=ability["ty"], enabled=ability["enabled"]
                    )
                )

        return message


COMMAND_BRIDGE = CommandBridge()


class PepperServicer(pepper_command_pb2_grpc.PepperServicer):
    """Pepper Grpc command server servicer."""

    QUEUE_TIMEOUT = 1

    def __init__(self):
        """Initialize server."""
        super().__init__()
        self.queue = COMMAND_BRIDGE
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)

    def ListenMovementCommand(
        self, request: empty_pb2.Empty, context
    ) -> AsyncIterable[pepper_command_pb2.Command]:
        """Send commands to client."""
        self.logger.info("Requested command stream.")
        while self.queue.accepting_cmds:
            try:
                yield self.queue.get(timeout=self.QUEUE_TIMEOUT)
            except Empty:
                continue

    def NotifyAnimationEnded(self, request: pepper_command_pb2.Uuid, context) -> empty_pb2.Empty:
        """Check a command has finished, and remove it from the queue."""
        self.logger.info(self.queue.pepper_tasks)
        self.logger.info(request)
        if request.message.startswith("Command"):
            self.queue.clear_action(request.uuid)
        return empty_pb2.Empty()


def serve_grpc() -> None:
    """Start and wait for server termination."""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    pepper_command_pb2_grpc.add_PepperServicer_to_server(PepperServicer(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    server.wait_for_termination()


def _print_clear_id(id: str) -> None:
    print("{} - cleared: {}".format(datetime.now().timestamp(), id))


if __name__ == "__main__":
    COMMAND_BRIDGE.set_clear_action(_print_clear_id)
    serve_grpc()
