import grpc
import pepper_command_pb2
import pepper_command_pb2_grpc
from google.protobuf import empty_pb2

with grpc.insecure_channel("[::]:50051") as channel:
    stub = pepper_command_pb2_grpc.PepperStub(channel)
    for x in stub.ListenMovementCommand(empty_pb2.Empty()):
        print(x)
        response = pepper_command_pb2.Uuid()
        response.uuid = x.uuid
        response.message = "Command done."
        stub.NotifyAnimationEnded(response)
