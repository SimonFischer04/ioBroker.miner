// Original file: bos/v1/authentication.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { LoginRequest as _braiins_bos_v1_LoginRequest, LoginRequest__Output as _braiins_bos_v1_LoginRequest__Output } from '../../../braiins/bos/v1/LoginRequest';
import type { LoginResponse as _braiins_bos_v1_LoginResponse, LoginResponse__Output as _braiins_bos_v1_LoginResponse__Output } from '../../../braiins/bos/v1/LoginResponse';
import type { SetPasswordRequest as _braiins_bos_v1_SetPasswordRequest, SetPasswordRequest__Output as _braiins_bos_v1_SetPasswordRequest__Output } from '../../../braiins/bos/v1/SetPasswordRequest';
import type { SetPasswordResponse as _braiins_bos_v1_SetPasswordResponse, SetPasswordResponse__Output as _braiins_bos_v1_SetPasswordResponse__Output } from '../../../braiins/bos/v1/SetPasswordResponse';

export interface AuthenticationServiceClient extends grpc.Client {
  Login(argument: _braiins_bos_v1_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _braiins_bos_v1_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _braiins_bos_v1_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  Login(argument: _braiins_bos_v1_LoginRequest, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _braiins_bos_v1_LoginRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _braiins_bos_v1_LoginRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _braiins_bos_v1_LoginRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  login(argument: _braiins_bos_v1_LoginRequest, callback: grpc.requestCallback<_braiins_bos_v1_LoginResponse__Output>): grpc.ClientUnaryCall;
  
  SetPassword(argument: _braiins_bos_v1_SetPasswordRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  SetPassword(argument: _braiins_bos_v1_SetPasswordRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  SetPassword(argument: _braiins_bos_v1_SetPasswordRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  SetPassword(argument: _braiins_bos_v1_SetPasswordRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  setPassword(argument: _braiins_bos_v1_SetPasswordRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  setPassword(argument: _braiins_bos_v1_SetPasswordRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  setPassword(argument: _braiins_bos_v1_SetPasswordRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  setPassword(argument: _braiins_bos_v1_SetPasswordRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPasswordResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthenticationServiceHandlers extends grpc.UntypedServiceImplementation {
  Login: grpc.handleUnaryCall<_braiins_bos_v1_LoginRequest__Output, _braiins_bos_v1_LoginResponse>;
  
  SetPassword: grpc.handleUnaryCall<_braiins_bos_v1_SetPasswordRequest__Output, _braiins_bos_v1_SetPasswordResponse>;
  
}

export interface AuthenticationServiceDefinition extends grpc.ServiceDefinition {
  Login: MethodDefinition<_braiins_bos_v1_LoginRequest, _braiins_bos_v1_LoginResponse, _braiins_bos_v1_LoginRequest__Output, _braiins_bos_v1_LoginResponse__Output>
  SetPassword: MethodDefinition<_braiins_bos_v1_SetPasswordRequest, _braiins_bos_v1_SetPasswordResponse, _braiins_bos_v1_SetPasswordRequest__Output, _braiins_bos_v1_SetPasswordResponse__Output>
}
