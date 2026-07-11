// Original file: bos/v1/pool.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreatePoolGroupRequest as _braiins_bos_v1_CreatePoolGroupRequest, CreatePoolGroupRequest__Output as _braiins_bos_v1_CreatePoolGroupRequest__Output } from '../../../braiins/bos/v1/CreatePoolGroupRequest';
import type { CreatePoolGroupResponse as _braiins_bos_v1_CreatePoolGroupResponse, CreatePoolGroupResponse__Output as _braiins_bos_v1_CreatePoolGroupResponse__Output } from '../../../braiins/bos/v1/CreatePoolGroupResponse';
import type { GetPoolGroupsRequest as _braiins_bos_v1_GetPoolGroupsRequest, GetPoolGroupsRequest__Output as _braiins_bos_v1_GetPoolGroupsRequest__Output } from '../../../braiins/bos/v1/GetPoolGroupsRequest';
import type { GetPoolGroupsResponse as _braiins_bos_v1_GetPoolGroupsResponse, GetPoolGroupsResponse__Output as _braiins_bos_v1_GetPoolGroupsResponse__Output } from '../../../braiins/bos/v1/GetPoolGroupsResponse';
import type { RemovePoolGroupRequest as _braiins_bos_v1_RemovePoolGroupRequest, RemovePoolGroupRequest__Output as _braiins_bos_v1_RemovePoolGroupRequest__Output } from '../../../braiins/bos/v1/RemovePoolGroupRequest';
import type { RemovePoolGroupResponse as _braiins_bos_v1_RemovePoolGroupResponse, RemovePoolGroupResponse__Output as _braiins_bos_v1_RemovePoolGroupResponse__Output } from '../../../braiins/bos/v1/RemovePoolGroupResponse';
import type { SetPoolGroupsRequest as _braiins_bos_v1_SetPoolGroupsRequest, SetPoolGroupsRequest__Output as _braiins_bos_v1_SetPoolGroupsRequest__Output } from '../../../braiins/bos/v1/SetPoolGroupsRequest';
import type { SetPoolGroupsResponse as _braiins_bos_v1_SetPoolGroupsResponse, SetPoolGroupsResponse__Output as _braiins_bos_v1_SetPoolGroupsResponse__Output } from '../../../braiins/bos/v1/SetPoolGroupsResponse';
import type { UpdatePoolGroupRequest as _braiins_bos_v1_UpdatePoolGroupRequest, UpdatePoolGroupRequest__Output as _braiins_bos_v1_UpdatePoolGroupRequest__Output } from '../../../braiins/bos/v1/UpdatePoolGroupRequest';
import type { UpdatePoolGroupResponse as _braiins_bos_v1_UpdatePoolGroupResponse, UpdatePoolGroupResponse__Output as _braiins_bos_v1_UpdatePoolGroupResponse__Output } from '../../../braiins/bos/v1/UpdatePoolGroupResponse';

export interface PoolServiceClient extends grpc.Client {
  CreatePoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  CreatePoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  CreatePoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  CreatePoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  createPoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  createPoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  createPoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  createPoolGroup(argument: _braiins_bos_v1_CreatePoolGroupRequest, callback: grpc.requestCallback<_braiins_bos_v1_CreatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  
  GetPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  GetPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  GetPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  GetPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  getPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  getPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  getPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  getPoolGroups(argument: _braiins_bos_v1_GetPoolGroupsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  
  RemovePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  RemovePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  RemovePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  RemovePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  removePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  removePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  removePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  removePoolGroup(argument: _braiins_bos_v1_RemovePoolGroupRequest, callback: grpc.requestCallback<_braiins_bos_v1_RemovePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  
  SetPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  SetPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  SetPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  SetPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  setPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  setPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  setPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  setPoolGroups(argument: _braiins_bos_v1_SetPoolGroupsRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPoolGroupsResponse__Output>): grpc.ClientUnaryCall;
  
  UpdatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  UpdatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  UpdatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  UpdatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  updatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  updatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  updatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  updatePoolGroup(argument: _braiins_bos_v1_UpdatePoolGroupRequest, callback: grpc.requestCallback<_braiins_bos_v1_UpdatePoolGroupResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface PoolServiceHandlers extends grpc.UntypedServiceImplementation {
  CreatePoolGroup: grpc.handleUnaryCall<_braiins_bos_v1_CreatePoolGroupRequest__Output, _braiins_bos_v1_CreatePoolGroupResponse>;
  
  GetPoolGroups: grpc.handleUnaryCall<_braiins_bos_v1_GetPoolGroupsRequest__Output, _braiins_bos_v1_GetPoolGroupsResponse>;
  
  RemovePoolGroup: grpc.handleUnaryCall<_braiins_bos_v1_RemovePoolGroupRequest__Output, _braiins_bos_v1_RemovePoolGroupResponse>;
  
  SetPoolGroups: grpc.handleUnaryCall<_braiins_bos_v1_SetPoolGroupsRequest__Output, _braiins_bos_v1_SetPoolGroupsResponse>;
  
  UpdatePoolGroup: grpc.handleUnaryCall<_braiins_bos_v1_UpdatePoolGroupRequest__Output, _braiins_bos_v1_UpdatePoolGroupResponse>;
  
}

export interface PoolServiceDefinition extends grpc.ServiceDefinition {
  CreatePoolGroup: MethodDefinition<_braiins_bos_v1_CreatePoolGroupRequest, _braiins_bos_v1_CreatePoolGroupResponse, _braiins_bos_v1_CreatePoolGroupRequest__Output, _braiins_bos_v1_CreatePoolGroupResponse__Output>
  GetPoolGroups: MethodDefinition<_braiins_bos_v1_GetPoolGroupsRequest, _braiins_bos_v1_GetPoolGroupsResponse, _braiins_bos_v1_GetPoolGroupsRequest__Output, _braiins_bos_v1_GetPoolGroupsResponse__Output>
  RemovePoolGroup: MethodDefinition<_braiins_bos_v1_RemovePoolGroupRequest, _braiins_bos_v1_RemovePoolGroupResponse, _braiins_bos_v1_RemovePoolGroupRequest__Output, _braiins_bos_v1_RemovePoolGroupResponse__Output>
  SetPoolGroups: MethodDefinition<_braiins_bos_v1_SetPoolGroupsRequest, _braiins_bos_v1_SetPoolGroupsResponse, _braiins_bos_v1_SetPoolGroupsRequest__Output, _braiins_bos_v1_SetPoolGroupsResponse__Output>
  UpdatePoolGroup: MethodDefinition<_braiins_bos_v1_UpdatePoolGroupRequest, _braiins_bos_v1_UpdatePoolGroupResponse, _braiins_bos_v1_UpdatePoolGroupRequest__Output, _braiins_bos_v1_UpdatePoolGroupResponse__Output>
}
