from concurrent import futures
from queue import Queue, Empty
from typing import AsyncIterable

import grpc
import pepper_command_pb2_grpc
import pepper_command_pb2
from google.protobuf import empty_pb2


class CommandBridge():
    _instance = None

    def __new__(cls):
        if not isinstance(cls._instance, cls):
            cls._instance = super(CommandBridge, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self.queue = Queue()
        self.accepting_cmds = True

    def stop(self):
        self.accepting_cmds = False

    def send_command(self, cmd: str) -> None:
        self.queue.put(cmd)

    def get(self, timeout: float) -> pepper_command_pb2.Command:
        cmd = self.queue.get(timeout=timeout)
        return pepper_command_pb2.Command(
            movement=cmd["movement"],
            say=cmd["say"],
            rotate=cmd["rot"],
            halt_last=cmd["halt"])


class PepperServicer(pepper_command_pb2_grpc.PepperServicer):
    QUEUE_TIMEOUT = 1

    def __init__(self):
        super().__init__()
        self.queue = CommandBridge()

    def ListenMovementCommand(
            self,
            request: empty_pb2.Empty,
            context) -> AsyncIterable[pepper_command_pb2.Command]:
        while self.queue.accepting_cmds:
            try:
                yield self.queue.get(timeout=self.QUEUE_TIMEOUT)
            except Empty:
                continue


def serve_grpc() -> None:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=2))
    pepper_command_pb2_grpc.add_PepperServicer_to_server(PepperServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()
