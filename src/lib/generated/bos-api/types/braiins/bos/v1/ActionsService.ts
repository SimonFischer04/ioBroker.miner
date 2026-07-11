// Original file: bos/v1/actions.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { FactoryResetRequest as _braiins_bos_v1_FactoryResetRequest, FactoryResetRequest__Output as _braiins_bos_v1_FactoryResetRequest__Output } from '../../../braiins/bos/v1/FactoryResetRequest';
import type { FactoryResetResponse as _braiins_bos_v1_FactoryResetResponse, FactoryResetResponse__Output as _braiins_bos_v1_FactoryResetResponse__Output } from '../../../braiins/bos/v1/FactoryResetResponse';
import type { GetLocateDeviceStatusRequest as _braiins_bos_v1_GetLocateDeviceStatusRequest, GetLocateDeviceStatusRequest__Output as _braiins_bos_v1_GetLocateDeviceStatusRequest__Output } from '../../../braiins/bos/v1/GetLocateDeviceStatusRequest';
import type { LocateDeviceStatusResponse as _braiins_bos_v1_LocateDeviceStatusResponse, LocateDeviceStatusResponse__Output as _braiins_bos_v1_LocateDeviceStatusResponse__Output } from '../../../braiins/bos/v1/LocateDeviceStatusResponse';
import type { PauseMiningRequest as _braiins_bos_v1_PauseMiningRequest, PauseMiningRequest__Output as _braiins_bos_v1_PauseMiningRequest__Output } from '../../../braiins/bos/v1/PauseMiningRequest';
import type { PauseMiningResponse as _braiins_bos_v1_PauseMiningResponse, PauseMiningResponse__Output as _braiins_bos_v1_PauseMiningResponse__Output } from '../../../braiins/bos/v1/PauseMiningResponse';
import type { RebootRequest as _braiins_bos_v1_RebootRequest, RebootRequest__Output as _braiins_bos_v1_RebootRequest__Output } from '../../../braiins/bos/v1/RebootRequest';
import type { RebootResponse as _braiins_bos_v1_RebootResponse, RebootResponse__Output as _braiins_bos_v1_RebootResponse__Output } from '../../../braiins/bos/v1/RebootResponse';
import type { RestartRequest as _braiins_bos_v1_RestartRequest, RestartRequest__Output as _braiins_bos_v1_RestartRequest__Output } from '../../../braiins/bos/v1/RestartRequest';
import type { RestartResponse as _braiins_bos_v1_RestartResponse, RestartResponse__Output as _braiins_bos_v1_RestartResponse__Output } from '../../../braiins/bos/v1/RestartResponse';
import type { ResumeMiningRequest as _braiins_bos_v1_ResumeMiningRequest, ResumeMiningRequest__Output as _braiins_bos_v1_ResumeMiningRequest__Output } from '../../../braiins/bos/v1/ResumeMiningRequest';
import type { ResumeMiningResponse as _braiins_bos_v1_ResumeMiningResponse, ResumeMiningResponse__Output as _braiins_bos_v1_ResumeMiningResponse__Output } from '../../../braiins/bos/v1/ResumeMiningResponse';
import type { SetLocateDeviceStatusRequest as _braiins_bos_v1_SetLocateDeviceStatusRequest, SetLocateDeviceStatusRequest__Output as _braiins_bos_v1_SetLocateDeviceStatusRequest__Output } from '../../../braiins/bos/v1/SetLocateDeviceStatusRequest';
import type { StartRequest as _braiins_bos_v1_StartRequest, StartRequest__Output as _braiins_bos_v1_StartRequest__Output } from '../../../braiins/bos/v1/StartRequest';
import type { StartResponse as _braiins_bos_v1_StartResponse, StartResponse__Output as _braiins_bos_v1_StartResponse__Output } from '../../../braiins/bos/v1/StartResponse';
import type { StopRequest as _braiins_bos_v1_StopRequest, StopRequest__Output as _braiins_bos_v1_StopRequest__Output } from '../../../braiins/bos/v1/StopRequest';
import type { StopResponse as _braiins_bos_v1_StopResponse, StopResponse__Output as _braiins_bos_v1_StopResponse__Output } from '../../../braiins/bos/v1/StopResponse';

export interface ActionsServiceClient extends grpc.Client {
  FactoryReset(argument: _braiins_bos_v1_FactoryResetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  FactoryReset(argument: _braiins_bos_v1_FactoryResetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  FactoryReset(argument: _braiins_bos_v1_FactoryResetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  FactoryReset(argument: _braiins_bos_v1_FactoryResetRequest, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  factoryReset(argument: _braiins_bos_v1_FactoryResetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  factoryReset(argument: _braiins_bos_v1_FactoryResetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  factoryReset(argument: _braiins_bos_v1_FactoryResetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  factoryReset(argument: _braiins_bos_v1_FactoryResetRequest, callback: grpc.requestCallback<_braiins_bos_v1_FactoryResetResponse__Output>): grpc.ClientUnaryCall;
  
  GetLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  GetLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  GetLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  GetLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  getLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  getLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  getLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  getLocateDeviceStatus(argument: _braiins_bos_v1_GetLocateDeviceStatusRequest, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  
  PauseMining(argument: _braiins_bos_v1_PauseMiningRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  PauseMining(argument: _braiins_bos_v1_PauseMiningRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  PauseMining(argument: _braiins_bos_v1_PauseMiningRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  PauseMining(argument: _braiins_bos_v1_PauseMiningRequest, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  pauseMining(argument: _braiins_bos_v1_PauseMiningRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  pauseMining(argument: _braiins_bos_v1_PauseMiningRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  pauseMining(argument: _braiins_bos_v1_PauseMiningRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  pauseMining(argument: _braiins_bos_v1_PauseMiningRequest, callback: grpc.requestCallback<_braiins_bos_v1_PauseMiningResponse__Output>): grpc.ClientUnaryCall;
  
  Reboot(argument: _braiins_bos_v1_RebootRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  Reboot(argument: _braiins_bos_v1_RebootRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  Reboot(argument: _braiins_bos_v1_RebootRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  Reboot(argument: _braiins_bos_v1_RebootRequest, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  reboot(argument: _braiins_bos_v1_RebootRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  reboot(argument: _braiins_bos_v1_RebootRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  reboot(argument: _braiins_bos_v1_RebootRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  reboot(argument: _braiins_bos_v1_RebootRequest, callback: grpc.requestCallback<_braiins_bos_v1_RebootResponse__Output>): grpc.ClientUnaryCall;
  
  Restart(argument: _braiins_bos_v1_RestartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  Restart(argument: _braiins_bos_v1_RestartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  Restart(argument: _braiins_bos_v1_RestartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  Restart(argument: _braiins_bos_v1_RestartRequest, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  restart(argument: _braiins_bos_v1_RestartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  restart(argument: _braiins_bos_v1_RestartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  restart(argument: _braiins_bos_v1_RestartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  restart(argument: _braiins_bos_v1_RestartRequest, callback: grpc.requestCallback<_braiins_bos_v1_RestartResponse__Output>): grpc.ClientUnaryCall;
  
  ResumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  ResumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  ResumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  ResumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  resumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  resumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  resumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  resumeMining(argument: _braiins_bos_v1_ResumeMiningRequest, callback: grpc.requestCallback<_braiins_bos_v1_ResumeMiningResponse__Output>): grpc.ClientUnaryCall;
  
  SetLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  SetLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  SetLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  SetLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  setLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  setLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  setLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  setLocateDeviceStatus(argument: _braiins_bos_v1_SetLocateDeviceStatusRequest, callback: grpc.requestCallback<_braiins_bos_v1_LocateDeviceStatusResponse__Output>): grpc.ClientUnaryCall;
  
  Start(argument: _braiins_bos_v1_StartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  Start(argument: _braiins_bos_v1_StartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  Start(argument: _braiins_bos_v1_StartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  Start(argument: _braiins_bos_v1_StartRequest, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  start(argument: _braiins_bos_v1_StartRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  start(argument: _braiins_bos_v1_StartRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  start(argument: _braiins_bos_v1_StartRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  start(argument: _braiins_bos_v1_StartRequest, callback: grpc.requestCallback<_braiins_bos_v1_StartResponse__Output>): grpc.ClientUnaryCall;
  
  Stop(argument: _braiins_bos_v1_StopRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  Stop(argument: _braiins_bos_v1_StopRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  Stop(argument: _braiins_bos_v1_StopRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  Stop(argument: _braiins_bos_v1_StopRequest, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  stop(argument: _braiins_bos_v1_StopRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  stop(argument: _braiins_bos_v1_StopRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  stop(argument: _braiins_bos_v1_StopRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  stop(argument: _braiins_bos_v1_StopRequest, callback: grpc.requestCallback<_braiins_bos_v1_StopResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface ActionsServiceHandlers extends grpc.UntypedServiceImplementation {
  FactoryReset: grpc.handleUnaryCall<_braiins_bos_v1_FactoryResetRequest__Output, _braiins_bos_v1_FactoryResetResponse>;
  
  GetLocateDeviceStatus: grpc.handleUnaryCall<_braiins_bos_v1_GetLocateDeviceStatusRequest__Output, _braiins_bos_v1_LocateDeviceStatusResponse>;
  
  PauseMining: grpc.handleUnaryCall<_braiins_bos_v1_PauseMiningRequest__Output, _braiins_bos_v1_PauseMiningResponse>;
  
  Reboot: grpc.handleUnaryCall<_braiins_bos_v1_RebootRequest__Output, _braiins_bos_v1_RebootResponse>;
  
  Restart: grpc.handleUnaryCall<_braiins_bos_v1_RestartRequest__Output, _braiins_bos_v1_RestartResponse>;
  
  ResumeMining: grpc.handleUnaryCall<_braiins_bos_v1_ResumeMiningRequest__Output, _braiins_bos_v1_ResumeMiningResponse>;
  
  SetLocateDeviceStatus: grpc.handleUnaryCall<_braiins_bos_v1_SetLocateDeviceStatusRequest__Output, _braiins_bos_v1_LocateDeviceStatusResponse>;
  
  Start: grpc.handleUnaryCall<_braiins_bos_v1_StartRequest__Output, _braiins_bos_v1_StartResponse>;
  
  Stop: grpc.handleUnaryCall<_braiins_bos_v1_StopRequest__Output, _braiins_bos_v1_StopResponse>;
  
}

export interface ActionsServiceDefinition extends grpc.ServiceDefinition {
  FactoryReset: MethodDefinition<_braiins_bos_v1_FactoryResetRequest, _braiins_bos_v1_FactoryResetResponse, _braiins_bos_v1_FactoryResetRequest__Output, _braiins_bos_v1_FactoryResetResponse__Output>
  GetLocateDeviceStatus: MethodDefinition<_braiins_bos_v1_GetLocateDeviceStatusRequest, _braiins_bos_v1_LocateDeviceStatusResponse, _braiins_bos_v1_GetLocateDeviceStatusRequest__Output, _braiins_bos_v1_LocateDeviceStatusResponse__Output>
  PauseMining: MethodDefinition<_braiins_bos_v1_PauseMiningRequest, _braiins_bos_v1_PauseMiningResponse, _braiins_bos_v1_PauseMiningRequest__Output, _braiins_bos_v1_PauseMiningResponse__Output>
  Reboot: MethodDefinition<_braiins_bos_v1_RebootRequest, _braiins_bos_v1_RebootResponse, _braiins_bos_v1_RebootRequest__Output, _braiins_bos_v1_RebootResponse__Output>
  Restart: MethodDefinition<_braiins_bos_v1_RestartRequest, _braiins_bos_v1_RestartResponse, _braiins_bos_v1_RestartRequest__Output, _braiins_bos_v1_RestartResponse__Output>
  ResumeMining: MethodDefinition<_braiins_bos_v1_ResumeMiningRequest, _braiins_bos_v1_ResumeMiningResponse, _braiins_bos_v1_ResumeMiningRequest__Output, _braiins_bos_v1_ResumeMiningResponse__Output>
  SetLocateDeviceStatus: MethodDefinition<_braiins_bos_v1_SetLocateDeviceStatusRequest, _braiins_bos_v1_LocateDeviceStatusResponse, _braiins_bos_v1_SetLocateDeviceStatusRequest__Output, _braiins_bos_v1_LocateDeviceStatusResponse__Output>
  Start: MethodDefinition<_braiins_bos_v1_StartRequest, _braiins_bos_v1_StartResponse, _braiins_bos_v1_StartRequest__Output, _braiins_bos_v1_StartResponse__Output>
  Stop: MethodDefinition<_braiins_bos_v1_StopRequest, _braiins_bos_v1_StopResponse, _braiins_bos_v1_StopRequest__Output, _braiins_bos_v1_StopResponse__Output>
}
