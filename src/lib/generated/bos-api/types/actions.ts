import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ActionsServiceClient as _braiins_bos_v1_ActionsServiceClient, ActionsServiceDefinition as _braiins_bos_v1_ActionsServiceDefinition } from './braiins/bos/v1/ActionsService';
import type { FactoryResetRequest as _braiins_bos_v1_FactoryResetRequest, FactoryResetRequest__Output as _braiins_bos_v1_FactoryResetRequest__Output } from './braiins/bos/v1/FactoryResetRequest';
import type { FactoryResetResponse as _braiins_bos_v1_FactoryResetResponse, FactoryResetResponse__Output as _braiins_bos_v1_FactoryResetResponse__Output } from './braiins/bos/v1/FactoryResetResponse';
import type { GetLocateDeviceStatusRequest as _braiins_bos_v1_GetLocateDeviceStatusRequest, GetLocateDeviceStatusRequest__Output as _braiins_bos_v1_GetLocateDeviceStatusRequest__Output } from './braiins/bos/v1/GetLocateDeviceStatusRequest';
import type { LocateDeviceStatusResponse as _braiins_bos_v1_LocateDeviceStatusResponse, LocateDeviceStatusResponse__Output as _braiins_bos_v1_LocateDeviceStatusResponse__Output } from './braiins/bos/v1/LocateDeviceStatusResponse';
import type { PauseMiningRequest as _braiins_bos_v1_PauseMiningRequest, PauseMiningRequest__Output as _braiins_bos_v1_PauseMiningRequest__Output } from './braiins/bos/v1/PauseMiningRequest';
import type { PauseMiningResponse as _braiins_bos_v1_PauseMiningResponse, PauseMiningResponse__Output as _braiins_bos_v1_PauseMiningResponse__Output } from './braiins/bos/v1/PauseMiningResponse';
import type { RebootRequest as _braiins_bos_v1_RebootRequest, RebootRequest__Output as _braiins_bos_v1_RebootRequest__Output } from './braiins/bos/v1/RebootRequest';
import type { RebootResponse as _braiins_bos_v1_RebootResponse, RebootResponse__Output as _braiins_bos_v1_RebootResponse__Output } from './braiins/bos/v1/RebootResponse';
import type { RestartRequest as _braiins_bos_v1_RestartRequest, RestartRequest__Output as _braiins_bos_v1_RestartRequest__Output } from './braiins/bos/v1/RestartRequest';
import type { RestartResponse as _braiins_bos_v1_RestartResponse, RestartResponse__Output as _braiins_bos_v1_RestartResponse__Output } from './braiins/bos/v1/RestartResponse';
import type { ResumeMiningRequest as _braiins_bos_v1_ResumeMiningRequest, ResumeMiningRequest__Output as _braiins_bos_v1_ResumeMiningRequest__Output } from './braiins/bos/v1/ResumeMiningRequest';
import type { ResumeMiningResponse as _braiins_bos_v1_ResumeMiningResponse, ResumeMiningResponse__Output as _braiins_bos_v1_ResumeMiningResponse__Output } from './braiins/bos/v1/ResumeMiningResponse';
import type { SetLocateDeviceStatusRequest as _braiins_bos_v1_SetLocateDeviceStatusRequest, SetLocateDeviceStatusRequest__Output as _braiins_bos_v1_SetLocateDeviceStatusRequest__Output } from './braiins/bos/v1/SetLocateDeviceStatusRequest';
import type { StartRequest as _braiins_bos_v1_StartRequest, StartRequest__Output as _braiins_bos_v1_StartRequest__Output } from './braiins/bos/v1/StartRequest';
import type { StartResponse as _braiins_bos_v1_StartResponse, StartResponse__Output as _braiins_bos_v1_StartResponse__Output } from './braiins/bos/v1/StartResponse';
import type { StopRequest as _braiins_bos_v1_StopRequest, StopRequest__Output as _braiins_bos_v1_StopRequest__Output } from './braiins/bos/v1/StopRequest';
import type { StopResponse as _braiins_bos_v1_StopResponse, StopResponse__Output as _braiins_bos_v1_StopResponse__Output } from './braiins/bos/v1/StopResponse';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        ActionsService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_ActionsServiceClient> & { service: _braiins_bos_v1_ActionsServiceDefinition }
        FactoryResetRequest: MessageTypeDefinition<_braiins_bos_v1_FactoryResetRequest, _braiins_bos_v1_FactoryResetRequest__Output>
        FactoryResetResponse: MessageTypeDefinition<_braiins_bos_v1_FactoryResetResponse, _braiins_bos_v1_FactoryResetResponse__Output>
        GetLocateDeviceStatusRequest: MessageTypeDefinition<_braiins_bos_v1_GetLocateDeviceStatusRequest, _braiins_bos_v1_GetLocateDeviceStatusRequest__Output>
        LocateDeviceStatusResponse: MessageTypeDefinition<_braiins_bos_v1_LocateDeviceStatusResponse, _braiins_bos_v1_LocateDeviceStatusResponse__Output>
        PauseMiningRequest: MessageTypeDefinition<_braiins_bos_v1_PauseMiningRequest, _braiins_bos_v1_PauseMiningRequest__Output>
        PauseMiningResponse: MessageTypeDefinition<_braiins_bos_v1_PauseMiningResponse, _braiins_bos_v1_PauseMiningResponse__Output>
        RebootRequest: MessageTypeDefinition<_braiins_bos_v1_RebootRequest, _braiins_bos_v1_RebootRequest__Output>
        RebootResponse: MessageTypeDefinition<_braiins_bos_v1_RebootResponse, _braiins_bos_v1_RebootResponse__Output>
        RestartRequest: MessageTypeDefinition<_braiins_bos_v1_RestartRequest, _braiins_bos_v1_RestartRequest__Output>
        RestartResponse: MessageTypeDefinition<_braiins_bos_v1_RestartResponse, _braiins_bos_v1_RestartResponse__Output>
        ResumeMiningRequest: MessageTypeDefinition<_braiins_bos_v1_ResumeMiningRequest, _braiins_bos_v1_ResumeMiningRequest__Output>
        ResumeMiningResponse: MessageTypeDefinition<_braiins_bos_v1_ResumeMiningResponse, _braiins_bos_v1_ResumeMiningResponse__Output>
        SetLocateDeviceStatusRequest: MessageTypeDefinition<_braiins_bos_v1_SetLocateDeviceStatusRequest, _braiins_bos_v1_SetLocateDeviceStatusRequest__Output>
        StartRequest: MessageTypeDefinition<_braiins_bos_v1_StartRequest, _braiins_bos_v1_StartRequest__Output>
        StartResponse: MessageTypeDefinition<_braiins_bos_v1_StartResponse, _braiins_bos_v1_StartResponse__Output>
        StopRequest: MessageTypeDefinition<_braiins_bos_v1_StopRequest, _braiins_bos_v1_StopRequest__Output>
        StopResponse: MessageTypeDefinition<_braiins_bos_v1_StopResponse, _braiins_bos_v1_StopResponse__Output>
      }
    }
  }
}

