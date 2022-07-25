from concurrent import futures
from queue import Queue, Empty
from typing import AsyncIterable

import grpc
import pepper_command_pb2_grpc
import pepper_command_pb2
from google.protobuf import empty_pb2


class CommandBridge():
    def __init__(self):
        self.accepting_cmds = True
        self.is_pepper_done = False
        self._queue = Queue()

    def stop(self):
        self.accepting_cmds = False

    def send_command(self, cmd: str) -> None:
        self._queue.put(cmd)

    def clear_queue(self) -> None:
        try:
            while True:
                self._queue.get_nowait()
        except Empty:
            pass

    def set_pepper_done(self) -> None:
        self.is_pepper_done = True

    def get(self, timeout: float) -> pepper_command_pb2.Command:
        cmd = self._queue.get(timeout=timeout)
        # cmd = {
        #     "movement": "asdf",
        #     "say": "ss",
        #     "rot": 0,
        #     "halt": True
        # }
        return pepper_command_pb2.Command(
            movement=cmd.get("movement", ""),
            say=cmd.get("say", ""),
            rotation=cmd.get("rot", 0.0),
            halt_last=cmd.get("halt", True))


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

    def NotifyAnimationEnded(self, request: empty_pb2.Empty, context) -> empty_pb2.Empty:
        self.queue.is_pepper_done = True


def serve_grpc() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    pepper_command_pb2_grpc.add_PepperServicer_to_server(PepperServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve_grpc()
