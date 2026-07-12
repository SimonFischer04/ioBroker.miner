// Original file: bos/v1/configuration.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetConstraintsRequest as _braiins_bos_v1_GetConstraintsRequest, GetConstraintsRequest__Output as _braiins_bos_v1_GetConstraintsRequest__Output } from '../../../braiins/bos/v1/GetConstraintsRequest';
import type { GetConstraintsResponse as _braiins_bos_v1_GetConstraintsResponse, GetConstraintsResponse__Output as _braiins_bos_v1_GetConstraintsResponse__Output } from '../../../braiins/bos/v1/GetConstraintsResponse';
import type { GetMinerConfigurationRequest as _braiins_bos_v1_GetMinerConfigurationRequest, GetMinerConfigurationRequest__Output as _braiins_bos_v1_GetMinerConfigurationRequest__Output } from '../../../braiins/bos/v1/GetMinerConfigurationRequest';
import type { GetMinerConfigurationResponse as _braiins_bos_v1_GetMinerConfigurationResponse, GetMinerConfigurationResponse__Output as _braiins_bos_v1_GetMinerConfigurationResponse__Output } from '../../../braiins/bos/v1/GetMinerConfigurationResponse';

export interface ConfigurationServiceClient extends grpc.Client {
  GetConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  GetConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  GetConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  GetConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  getConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  getConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  getConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  getConstraints(argument: _braiins_bos_v1_GetConstraintsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetConstraintsResponse__Output>): grpc.ClientUnaryCall;
  
  GetMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  GetMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  GetMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  GetMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  getMinerConfiguration(argument: _braiins_bos_v1_GetMinerConfigurationRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerConfigurationResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ConfigurationServiceHandlers extends grpc.UntypedServiceImplementation {
  GetConstraints: grpc.handleUnaryCall<_braiins_bos_v1_GetConstraintsRequest__Output, _braiins_bos_v1_GetConstraintsResponse>;
  
  GetMinerConfiguration: grpc.handleUnaryCall<_braiins_bos_v1_GetMinerConfigurationRequest__Output, _braiins_bos_v1_GetMinerConfigurationResponse>;
  
}

export interface ConfigurationServiceDefinition extends grpc.ServiceDefinition {
  GetConstraints: MethodDefinition<_braiins_bos_v1_GetConstraintsRequest, _braiins_bos_v1_GetConstraintsResponse, _braiins_bos_v1_GetConstraintsRequest__Output, _braiins_bos_v1_GetConstraintsResponse__Output>
  GetMinerConfiguration: MethodDefinition<_braiins_bos_v1_GetMinerConfigurationRequest, _braiins_bos_v1_GetMinerConfigurationResponse, _braiins_bos_v1_GetMinerConfigurationRequest__Output, _braiins_bos_v1_GetMinerConfigurationResponse__Output>
}
