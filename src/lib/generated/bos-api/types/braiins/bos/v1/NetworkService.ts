// Original file: bos/v1/network.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetNetworkConfigurationRequest as _braiins_bos_v1_GetNetworkConfigurationRequest, GetNetworkConfigurationRequest__Output as _braiins_bos_v1_GetNetworkConfigurationRequest__Output } from '../../../braiins/bos/v1/GetNetworkConfigurationRequest';
import type { GetNetworkConfigurationResponse as _braiins_bos_v1_GetNetworkConfigurationResponse, GetNetworkConfigurationResponse__Output as _braiins_bos_v1_GetNetworkConfigurationResponse__Output } from '../../../braiins/bos/v1/GetNetworkConfigurationResponse';
import type { GetNetworkInfoRequest as _braiins_bos_v1_GetNetworkInfoRequest, GetNetworkInfoRequest__Output as _braiins_bos_v1_GetNetworkInfoRequest__Output } from '../../../braiins/bos/v1/GetNetworkInfoRequest';
import type { GetNetworkInfoResponse as _braiins_bos_v1_GetNetworkInfoResponse, GetNetworkInfoResponse__Output as _braiins_bos_v1_GetNetworkInfoResponse__Output } from '../../../braiins/bos/v1/GetNetworkInfoResponse';
import type { SetNetworkConfigurationRequest as _braiins_bos_v1_SetNetworkConfigurationRequest, SetNetworkConfigurationRequest__Output as _braiins_bos_v1_SetNetworkConfigurationRequest__Output } from '../../../braiins/bos/v1/SetNetworkConfigurationRequest';
import type { SetNetworkConfigurationResponse as _braiins_bos_v1_SetNetworkConfigurationResponse, SetNetworkConfigurationResponse__Output as _braiins_bos_v1_SetNetworkConfigurationResponse__Output } from '../../../braiins/bos/v1/SetNetworkConfigurationResponse';

export interface NetworkServiceClient extends grpc.Client {
  GetNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  GetNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  GetNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  GetNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getNetworkConfiguration(argument: _braiins_bos_v1_GetNetworkConfigurationRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  
  GetNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  GetNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  GetNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  GetNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  getNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  getNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  getNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  getNetworkInfo(argument: _braiins_bos_v1_GetNetworkInfoRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetNetworkInfoResponse__Output>): grpc.ClientUnaryCall;
  
  SetNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  SetNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  SetNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  SetNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  setNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  setNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  setNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  setNetworkConfiguration(argument: _braiins_bos_v1_SetNetworkConfigurationRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetNetworkConfigurationResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface NetworkServiceHandlers extends grpc.UntypedServiceImplementation {
  GetNetworkConfiguration: grpc.handleUnaryCall<_braiins_bos_v1_GetNetworkConfigurationRequest__Output, _braiins_bos_v1_GetNetworkConfigurationResponse>;
  
  GetNetworkInfo: grpc.handleUnaryCall<_braiins_bos_v1_GetNetworkInfoRequest__Output, _braiins_bos_v1_GetNetworkInfoResponse>;
  
  SetNetworkConfiguration: grpc.handleUnaryCall<_braiins_bos_v1_SetNetworkConfigurationRequest__Output, _braiins_bos_v1_SetNetworkConfigurationResponse>;
  
}

export interface NetworkServiceDefinition extends grpc.ServiceDefinition {
  GetNetworkConfiguration: MethodDefinition<_braiins_bos_v1_GetNetworkConfigurationRequest, _braiins_bos_v1_GetNetworkConfigurationResponse, _braiins_bos_v1_GetNetworkConfigurationRequest__Output, _braiins_bos_v1_GetNetworkConfigurationResponse__Output>
  GetNetworkInfo: MethodDefinition<_braiins_bos_v1_GetNetworkInfoRequest, _braiins_bos_v1_GetNetworkInfoResponse, _braiins_bos_v1_GetNetworkInfoRequest__Output, _braiins_bos_v1_GetNetworkInfoResponse__Output>
  SetNetworkConfiguration: MethodDefinition<_braiins_bos_v1_SetNetworkConfigurationRequest, _braiins_bos_v1_SetNetworkConfigurationResponse, _braiins_bos_v1_SetNetworkConfigurationRequest__Output, _braiins_bos_v1_SetNetworkConfigurationResponse__Output>
}
