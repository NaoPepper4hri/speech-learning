import grpc
import pepper_command_pb2
import pepper_command_pb2_grpc
import uuid

from concurrent import futures
from google.protobuf import empty_pb2
from queue import Queue, Empty
from typing import AsyncIterable, Dict, List


class CommandBridge():
    def __init__(self) -> None:
        self.accepting_cmds = True
        self.pepper_tasks = {}
        self._queue = Queue()

    def stop(self) -> None:
        self.accepting_cmds = False

    def send_command(self, cmd: str) -> None:
        self._queue.put(cmd)

    def is_pepper_done(self) -> bool:
        return len(list(self.pepper_tasks.keys())) == 0

    def clear_queue(self) -> None:
        try:
            while True:
                self._queue.get_nowait()
        except Empty:
            pass

    def clear_action(self, uid: str) -> None:
        self.pepper_tasks.pop(uid)

    def get(self, timeout: float) -> pepper_command_pb2.Command:
        # cmd = {
        #     "animation": {
        #         "name": "asdf",
        #         "halt_last": False,
        #     },
        #     "say": "ss",
        #     "goto": {
        #         "x": 0.0,
        #         "y": 0.0,
        #         "theta": 0.0 #  <- Radians
        #     },
        #     "abilities": [
        #         {
        #             "ty": pepper_command_pb2.Command.AutonomousAbilities.Ability.BASIC_AWARENESS,
        #             "enabled": False,
        #         },
        #         {
        #             "ty": pepper_command_pb2.Command.AutonomousAbilities.Ability.BACKGROUND_MOVEMENT,
        #             "enabled": True,
        #         },
        #     ]
        # }
        cmd = self._queue.get(timeout=timeout)
        _uid = str(uuid.uuid1())
        self.pepper_tasks[_uid] = cmd

        message = pepper_command_pb2.Command()

        message.uuid = _uid

        if "animation" in cmd:
            print("here")
            print("message.hasAnimation()")
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
                        ty=ability["ty"],
                        enabled=ability["enabled"]
                    )
                )

        return message


COMMAND_BRIDGE = CommandBridge()


class PepperServicer(pepper_command_pb2_grpc.PepperServicer):
    QUEUE_TIMEOUT = 1

    def __init__(self):
        super().__init__()
        self.queue = COMMAND_BRIDGE

    def ListenMovementCommand(
            self,
            request: empty_pb2.Empty,
            context) -> AsyncIterable[pepper_command_pb2.Command]:
        while self.queue.accepting_cmds:
            try:
                yield self.queue.get(timeout=self.QUEUE_TIMEOUT)
            except Empty:
                continue

    def NotifyAnimationEnded(self, request: pepper_command_pb2.Uuid, context) -> empty_pb2.Empty:
        self.queue.clear_action(request.uuid)


def serve_grpc() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    pepper_command_pb2_grpc.add_PepperServicer_to_server(PepperServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve_grpc()
