import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AuthenticationServiceClient as _braiins_bos_v1_AuthenticationServiceClient, AuthenticationServiceDefinition as _braiins_bos_v1_AuthenticationServiceDefinition } from './braiins/bos/v1/AuthenticationService';
import type { LoginRequest as _braiins_bos_v1_LoginRequest, LoginRequest__Output as _braiins_bos_v1_LoginRequest__Output } from './braiins/bos/v1/LoginRequest';
import type { LoginResponse as _braiins_bos_v1_LoginResponse, LoginResponse__Output as _braiins_bos_v1_LoginResponse__Output } from './braiins/bos/v1/LoginResponse';
import type { SetPasswordRequest as _braiins_bos_v1_SetPasswordRequest, SetPasswordRequest__Output as _braiins_bos_v1_SetPasswordRequest__Output } from './braiins/bos/v1/SetPasswordRequest';
import type { SetPasswordResponse as _braiins_bos_v1_SetPasswordResponse, SetPasswordResponse__Output as _braiins_bos_v1_SetPasswordResponse__Output } from './braiins/bos/v1/SetPasswordResponse';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        AuthenticationService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_AuthenticationServiceClient> & { service: _braiins_bos_v1_AuthenticationServiceDefinition }
        LoginRequest: MessageTypeDefinition<_braiins_bos_v1_LoginRequest, _braiins_bos_v1_LoginRequest__Output>
        LoginResponse: MessageTypeDefinition<_braiins_bos_v1_LoginResponse, _braiins_bos_v1_LoginResponse__Output>
        SetPasswordRequest: MessageTypeDefinition<_braiins_bos_v1_SetPasswordRequest, _braiins_bos_v1_SetPasswordRequest__Output>
        SetPasswordResponse: MessageTypeDefinition<_braiins_bos_v1_SetPasswordResponse, _braiins_bos_v1_SetPasswordResponse__Output>
      }
    }
  }
}

