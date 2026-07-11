// Original file: bos/v1/cooling.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetCoolingStateRequest as _braiins_bos_v1_GetCoolingStateRequest, GetCoolingStateRequest__Output as _braiins_bos_v1_GetCoolingStateRequest__Output } from '../../../braiins/bos/v1/GetCoolingStateRequest';
import type { GetCoolingStateResponse as _braiins_bos_v1_GetCoolingStateResponse, GetCoolingStateResponse__Output as _braiins_bos_v1_GetCoolingStateResponse__Output } from '../../../braiins/bos/v1/GetCoolingStateResponse';
import type { SetCoolingModeRequest as _braiins_bos_v1_SetCoolingModeRequest, SetCoolingModeRequest__Output as _braiins_bos_v1_SetCoolingModeRequest__Output } from '../../../braiins/bos/v1/SetCoolingModeRequest';
import type { SetCoolingModeResponse as _braiins_bos_v1_SetCoolingModeResponse, SetCoolingModeResponse__Output as _braiins_bos_v1_SetCoolingModeResponse__Output } from '../../../braiins/bos/v1/SetCoolingModeResponse';
import type { SetImmersionModeRequest as _braiins_bos_v1_SetImmersionModeRequest, SetImmersionModeRequest__Output as _braiins_bos_v1_SetImmersionModeRequest__Output } from '../../../braiins/bos/v1/SetImmersionModeRequest';
import type { SetImmersionModeResponse as _braiins_bos_v1_SetImmersionModeResponse, SetImmersionModeResponse__Output as _braiins_bos_v1_SetImmersionModeResponse__Output } from '../../../braiins/bos/v1/SetImmersionModeResponse';

export interface CoolingServiceClient extends grpc.Client {
  GetCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  GetCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  GetCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  GetCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  getCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  getCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  getCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  getCoolingState(argument: _braiins_bos_v1_GetCoolingStateRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetCoolingStateResponse__Output>): grpc.ClientUnaryCall;
  
  SetCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  SetCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  SetCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  SetCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  setCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  setCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  setCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  setCoolingMode(argument: _braiins_bos_v1_SetCoolingModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetCoolingModeResponse__Output>): grpc.ClientUnaryCall;
  
  SetImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  SetImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  SetImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  SetImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  setImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  setImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  setImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  setImmersionMode(argument: _braiins_bos_v1_SetImmersionModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetImmersionModeResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface CoolingServiceHandlers extends grpc.UntypedServiceImplementation {
  GetCoolingState: grpc.handleUnaryCall<_braiins_bos_v1_GetCoolingStateRequest__Output, _braiins_bos_v1_GetCoolingStateResponse>;
  
  SetCoolingMode: grpc.handleUnaryCall<_braiins_bos_v1_SetCoolingModeRequest__Output, _braiins_bos_v1_SetCoolingModeResponse>;
  
  SetImmersionMode: grpc.handleUnaryCall<_braiins_bos_v1_SetImmersionModeRequest__Output, _braiins_bos_v1_SetImmersionModeResponse>;
  
}

export interface CoolingServiceDefinition extends grpc.ServiceDefinition {
  GetCoolingState: MethodDefinition<_braiins_bos_v1_GetCoolingStateRequest, _braiins_bos_v1_GetCoolingStateResponse, _braiins_bos_v1_GetCoolingStateRequest__Output, _braiins_bos_v1_GetCoolingStateResponse__Output>
  SetCoolingMode: MethodDefinition<_braiins_bos_v1_SetCoolingModeRequest, _braiins_bos_v1_SetCoolingModeResponse, _braiins_bos_v1_SetCoolingModeRequest__Output, _braiins_bos_v1_SetCoolingModeResponse__Output>
  SetImmersionMode: MethodDefinition<_braiins_bos_v1_SetImmersionModeRequest, _braiins_bos_v1_SetImmersionModeResponse, _braiins_bos_v1_SetImmersionModeRequest__Output, _braiins_bos_v1_SetImmersionModeResponse__Output>
}
