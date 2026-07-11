import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { CreatePoolGroupRequest as _braiins_bos_v1_CreatePoolGroupRequest, CreatePoolGroupRequest__Output as _braiins_bos_v1_CreatePoolGroupRequest__Output } from './braiins/bos/v1/CreatePoolGroupRequest';
import type { CreatePoolGroupResponse as _braiins_bos_v1_CreatePoolGroupResponse, CreatePoolGroupResponse__Output as _braiins_bos_v1_CreatePoolGroupResponse__Output } from './braiins/bos/v1/CreatePoolGroupResponse';
import type { FixedShareRatio as _braiins_bos_v1_FixedShareRatio, FixedShareRatio__Output as _braiins_bos_v1_FixedShareRatio__Output } from './braiins/bos/v1/FixedShareRatio';
import type { GetPoolGroupsRequest as _braiins_bos_v1_GetPoolGroupsRequest, GetPoolGroupsRequest__Output as _braiins_bos_v1_GetPoolGroupsRequest__Output } from './braiins/bos/v1/GetPoolGroupsRequest';
import type { GetPoolGroupsResponse as _braiins_bos_v1_GetPoolGroupsResponse, GetPoolGroupsResponse__Output as _braiins_bos_v1_GetPoolGroupsResponse__Output } from './braiins/bos/v1/GetPoolGroupsResponse';
import type { Pool as _braiins_bos_v1_Pool, Pool__Output as _braiins_bos_v1_Pool__Output } from './braiins/bos/v1/Pool';
import type { PoolConfiguration as _braiins_bos_v1_PoolConfiguration, PoolConfiguration__Output as _braiins_bos_v1_PoolConfiguration__Output } from './braiins/bos/v1/PoolConfiguration';
import type { PoolGroup as _braiins_bos_v1_PoolGroup, PoolGroup__Output as _braiins_bos_v1_PoolGroup__Output } from './braiins/bos/v1/PoolGroup';
import type { PoolGroupConfiguration as _braiins_bos_v1_PoolGroupConfiguration, PoolGroupConfiguration__Output as _braiins_bos_v1_PoolGroupConfiguration__Output } from './braiins/bos/v1/PoolGroupConfiguration';
import type { PoolServiceClient as _braiins_bos_v1_PoolServiceClient, PoolServiceDefinition as _braiins_bos_v1_PoolServiceDefinition } from './braiins/bos/v1/PoolService';
import type { PoolStats as _braiins_bos_v1_PoolStats, PoolStats__Output as _braiins_bos_v1_PoolStats__Output } from './braiins/bos/v1/PoolStats';
import type { Quota as _braiins_bos_v1_Quota, Quota__Output as _braiins_bos_v1_Quota__Output } from './braiins/bos/v1/Quota';
import type { RemovePoolGroupRequest as _braiins_bos_v1_RemovePoolGroupRequest, RemovePoolGroupRequest__Output as _braiins_bos_v1_RemovePoolGroupRequest__Output } from './braiins/bos/v1/RemovePoolGroupRequest';
import type { RemovePoolGroupResponse as _braiins_bos_v1_RemovePoolGroupResponse, RemovePoolGroupResponse__Output as _braiins_bos_v1_RemovePoolGroupResponse__Output } from './braiins/bos/v1/RemovePoolGroupResponse';
import type { SetPoolGroupsRequest as _braiins_bos_v1_SetPoolGroupsRequest, SetPoolGroupsRequest__Output as _braiins_bos_v1_SetPoolGroupsRequest__Output } from './braiins/bos/v1/SetPoolGroupsRequest';
import type { SetPoolGroupsResponse as _braiins_bos_v1_SetPoolGroupsResponse, SetPoolGroupsResponse__Output as _braiins_bos_v1_SetPoolGroupsResponse__Output } from './braiins/bos/v1/SetPoolGroupsResponse';
import type { UpdatePoolGroupRequest as _braiins_bos_v1_UpdatePoolGroupRequest, UpdatePoolGroupRequest__Output as _braiins_bos_v1_UpdatePoolGroupRequest__Output } from './braiins/bos/v1/UpdatePoolGroupRequest';
import type { UpdatePoolGroupResponse as _braiins_bos_v1_UpdatePoolGroupResponse, UpdatePoolGroupResponse__Output as _braiins_bos_v1_UpdatePoolGroupResponse__Output } from './braiins/bos/v1/UpdatePoolGroupResponse';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        CreatePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_CreatePoolGroupRequest, _braiins_bos_v1_CreatePoolGroupRequest__Output>
        CreatePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_CreatePoolGroupResponse, _braiins_bos_v1_CreatePoolGroupResponse__Output>
        FixedShareRatio: MessageTypeDefinition<_braiins_bos_v1_FixedShareRatio, _braiins_bos_v1_FixedShareRatio__Output>
        GetPoolGroupsRequest: MessageTypeDefinition<_braiins_bos_v1_GetPoolGroupsRequest, _braiins_bos_v1_GetPoolGroupsRequest__Output>
        GetPoolGroupsResponse: MessageTypeDefinition<_braiins_bos_v1_GetPoolGroupsResponse, _braiins_bos_v1_GetPoolGroupsResponse__Output>
        Pool: MessageTypeDefinition<_braiins_bos_v1_Pool, _braiins_bos_v1_Pool__Output>
        PoolConfiguration: MessageTypeDefinition<_braiins_bos_v1_PoolConfiguration, _braiins_bos_v1_PoolConfiguration__Output>
        PoolGroup: MessageTypeDefinition<_braiins_bos_v1_PoolGroup, _braiins_bos_v1_PoolGroup__Output>
        PoolGroupConfiguration: MessageTypeDefinition<_braiins_bos_v1_PoolGroupConfiguration, _braiins_bos_v1_PoolGroupConfiguration__Output>
        PoolService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_PoolServiceClient> & { service: _braiins_bos_v1_PoolServiceDefinition }
        PoolStats: MessageTypeDefinition<_braiins_bos_v1_PoolStats, _braiins_bos_v1_PoolStats__Output>
        Quota: MessageTypeDefinition<_braiins_bos_v1_Quota, _braiins_bos_v1_Quota__Output>
        RemovePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_RemovePoolGroupRequest, _braiins_bos_v1_RemovePoolGroupRequest__Output>
        RemovePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_RemovePoolGroupResponse, _braiins_bos_v1_RemovePoolGroupResponse__Output>
        SaveAction: EnumTypeDefinition
        SetPoolGroupsRequest: MessageTypeDefinition<_braiins_bos_v1_SetPoolGroupsRequest, _braiins_bos_v1_SetPoolGroupsRequest__Output>
        SetPoolGroupsResponse: MessageTypeDefinition<_braiins_bos_v1_SetPoolGroupsResponse, _braiins_bos_v1_SetPoolGroupsResponse__Output>
        UpdatePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_UpdatePoolGroupRequest, _braiins_bos_v1_UpdatePoolGroupRequest__Output>
        UpdatePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_UpdatePoolGroupResponse, _braiins_bos_v1_UpdatePoolGroupResponse__Output>
      }
    }
  }
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
}

