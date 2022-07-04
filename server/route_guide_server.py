from queue import Queue, Empty
from typing import AsyncIterable

import grpc
import pepper_command_pb2_grpc
import pepper_command_pb2
from google.protobuf import empty_pb2


class PepperServicer(pepper_command_pb2_grpc.PepperServicer):
    QUEUE_TIMEOUT = 1

    def __init__(self):
        super().__init__()
        self.queue = Queue()
        self.accepting_cmds = True

    def send_command(self, cmd: str) -> None:
        self.queue.put({"movement": cmd, "halt": True})

    def stop(self):
        self.accepting_cmds = False

    async def ListenMovementCommand(
            self,
            request: empty_pb2.Empty,
            context) -> AsyncIterable[pepper_command_pb2.Command]:
        while self.accepting_cmds:
            try:
                cmd = self.queue.get(timeout=self.QUEUE_TIMEOUT)
                yield pepper_command_pb2.Command(movement=cmd["movement"], halt_last=cmd["halt"])
            except Empty:
                continue


async def serve_grpc() -> None:
    server = grpc.aio.server()
    pepper_command_pb2_grpc.add_PepperServicer_to_server(PepperServicer(), server)
    server.add_insecure_port('[::]:50051')
    await server.start()
    await server.wait_for_termination()
