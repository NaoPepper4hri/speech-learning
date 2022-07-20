import grpc
import pepper_command_pb2_grpc
import pepper_command_pb2
from google.protobuf import empty_pb2

with grpc.insecure_channel('localhost:50051') as channel:
    stub = pepper_command_pb2_grpc.PepperStub(channel)
    for x in stub.ListenMovementCommand(pepper_command_pb2.Command(movement="hehe")):
        print(x)
