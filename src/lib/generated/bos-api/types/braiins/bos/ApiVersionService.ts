// Original file: bos/version.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { ApiVersion as _braiins_bos_ApiVersion, ApiVersion__Output as _braiins_bos_ApiVersion__Output } from '../../braiins/bos/ApiVersion';
import type { ApiVersionRequest as _braiins_bos_ApiVersionRequest, ApiVersionRequest__Output as _braiins_bos_ApiVersionRequest__Output } from '../../braiins/bos/ApiVersionRequest';

export interface ApiVersionServiceClient extends grpc.Client {
  GetApiVersion(argument: _braiins_bos_ApiVersionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  GetApiVersion(argument: _braiins_bos_ApiVersionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  GetApiVersion(argument: _braiins_bos_ApiVersionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  GetApiVersion(argument: _braiins_bos_ApiVersionRequest, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  getApiVersion(argument: _braiins_bos_ApiVersionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  getApiVersion(argument: _braiins_bos_ApiVersionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  getApiVersion(argument: _braiins_bos_ApiVersionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  getApiVersion(argument: _braiins_bos_ApiVersionRequest, callback: grpc.requestCallback<_braiins_bos_ApiVersion__Output>): grpc.ClientUnaryCall;
  
}

export interface ApiVersionServiceHandlers extends grpc.UntypedServiceImplementation {
  GetApiVersion: grpc.handleUnaryCall<_braiins_bos_ApiVersionRequest__Output, _braiins_bos_ApiVersion>;
  
}

export interface ApiVersionServiceDefinition extends grpc.ServiceDefinition {
  GetApiVersion: MethodDefinition<_braiins_bos_ApiVersionRequest, _braiins_bos_ApiVersion, _braiins_bos_ApiVersionRequest__Output, _braiins_bos_ApiVersion__Output>
}
