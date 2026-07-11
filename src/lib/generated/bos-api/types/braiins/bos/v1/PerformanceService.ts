// Original file: bos/v1/performance.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DecrementHashrateTargetRequest as _braiins_bos_v1_DecrementHashrateTargetRequest, DecrementHashrateTargetRequest__Output as _braiins_bos_v1_DecrementHashrateTargetRequest__Output } from '../../../braiins/bos/v1/DecrementHashrateTargetRequest';
import type { DecrementPowerTargetRequest as _braiins_bos_v1_DecrementPowerTargetRequest, DecrementPowerTargetRequest__Output as _braiins_bos_v1_DecrementPowerTargetRequest__Output } from '../../../braiins/bos/v1/DecrementPowerTargetRequest';
import type { GetMinerEfficiencyProfileRequest as _braiins_bos_v1_GetMinerEfficiencyProfileRequest, GetMinerEfficiencyProfileRequest__Output as _braiins_bos_v1_GetMinerEfficiencyProfileRequest__Output } from '../../../braiins/bos/v1/GetMinerEfficiencyProfileRequest';
import type { GetMinerEfficiencyProfileResponse as _braiins_bos_v1_GetMinerEfficiencyProfileResponse, GetMinerEfficiencyProfileResponse__Output as _braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output } from '../../../braiins/bos/v1/GetMinerEfficiencyProfileResponse';
import type { GetPerformanceModeRequest as _braiins_bos_v1_GetPerformanceModeRequest, GetPerformanceModeRequest__Output as _braiins_bos_v1_GetPerformanceModeRequest__Output } from '../../../braiins/bos/v1/GetPerformanceModeRequest';
import type { GetTunerStateRequest as _braiins_bos_v1_GetTunerStateRequest, GetTunerStateRequest__Output as _braiins_bos_v1_GetTunerStateRequest__Output } from '../../../braiins/bos/v1/GetTunerStateRequest';
import type { GetTunerStateResponse as _braiins_bos_v1_GetTunerStateResponse, GetTunerStateResponse__Output as _braiins_bos_v1_GetTunerStateResponse__Output } from '../../../braiins/bos/v1/GetTunerStateResponse';
import type { IncrementHashrateTargetRequest as _braiins_bos_v1_IncrementHashrateTargetRequest, IncrementHashrateTargetRequest__Output as _braiins_bos_v1_IncrementHashrateTargetRequest__Output } from '../../../braiins/bos/v1/IncrementHashrateTargetRequest';
import type { IncrementPowerTargetRequest as _braiins_bos_v1_IncrementPowerTargetRequest, IncrementPowerTargetRequest__Output as _braiins_bos_v1_IncrementPowerTargetRequest__Output } from '../../../braiins/bos/v1/IncrementPowerTargetRequest';
import type { ListTargetProfilesRequest as _braiins_bos_v1_ListTargetProfilesRequest, ListTargetProfilesRequest__Output as _braiins_bos_v1_ListTargetProfilesRequest__Output } from '../../../braiins/bos/v1/ListTargetProfilesRequest';
import type { ListTargetProfilesResponse as _braiins_bos_v1_ListTargetProfilesResponse, ListTargetProfilesResponse__Output as _braiins_bos_v1_ListTargetProfilesResponse__Output } from '../../../braiins/bos/v1/ListTargetProfilesResponse';
import type { PerformanceMode as _braiins_bos_v1_PerformanceMode, PerformanceMode__Output as _braiins_bos_v1_PerformanceMode__Output } from '../../../braiins/bos/v1/PerformanceMode';
import type { QuickRampingResponse as _braiins_bos_v1_QuickRampingResponse, QuickRampingResponse__Output as _braiins_bos_v1_QuickRampingResponse__Output } from '../../../braiins/bos/v1/QuickRampingResponse';
import type { RemoveTunedProfilesRequest as _braiins_bos_v1_RemoveTunedProfilesRequest, RemoveTunedProfilesRequest__Output as _braiins_bos_v1_RemoveTunedProfilesRequest__Output } from '../../../braiins/bos/v1/RemoveTunedProfilesRequest';
import type { RemoveTunedProfilesResponse as _braiins_bos_v1_RemoveTunedProfilesResponse, RemoveTunedProfilesResponse__Output as _braiins_bos_v1_RemoveTunedProfilesResponse__Output } from '../../../braiins/bos/v1/RemoveTunedProfilesResponse';
import type { SetDPSRequest as _braiins_bos_v1_SetDPSRequest, SetDPSRequest__Output as _braiins_bos_v1_SetDPSRequest__Output } from '../../../braiins/bos/v1/SetDPSRequest';
import type { SetDPSResponse as _braiins_bos_v1_SetDPSResponse, SetDPSResponse__Output as _braiins_bos_v1_SetDPSResponse__Output } from '../../../braiins/bos/v1/SetDPSResponse';
import type { SetDefaultHashrateTargetRequest as _braiins_bos_v1_SetDefaultHashrateTargetRequest, SetDefaultHashrateTargetRequest__Output as _braiins_bos_v1_SetDefaultHashrateTargetRequest__Output } from '../../../braiins/bos/v1/SetDefaultHashrateTargetRequest';
import type { SetDefaultPowerTargetRequest as _braiins_bos_v1_SetDefaultPowerTargetRequest, SetDefaultPowerTargetRequest__Output as _braiins_bos_v1_SetDefaultPowerTargetRequest__Output } from '../../../braiins/bos/v1/SetDefaultPowerTargetRequest';
import type { SetDefaultQuickRampingRequest as _braiins_bos_v1_SetDefaultQuickRampingRequest, SetDefaultQuickRampingRequest__Output as _braiins_bos_v1_SetDefaultQuickRampingRequest__Output } from '../../../braiins/bos/v1/SetDefaultQuickRampingRequest';
import type { SetHashrateTargetRequest as _braiins_bos_v1_SetHashrateTargetRequest, SetHashrateTargetRequest__Output as _braiins_bos_v1_SetHashrateTargetRequest__Output } from '../../../braiins/bos/v1/SetHashrateTargetRequest';
import type { SetHashrateTargetResponse as _braiins_bos_v1_SetHashrateTargetResponse, SetHashrateTargetResponse__Output as _braiins_bos_v1_SetHashrateTargetResponse__Output } from '../../../braiins/bos/v1/SetHashrateTargetResponse';
import type { SetPerformanceModeRequest as _braiins_bos_v1_SetPerformanceModeRequest, SetPerformanceModeRequest__Output as _braiins_bos_v1_SetPerformanceModeRequest__Output } from '../../../braiins/bos/v1/SetPerformanceModeRequest';
import type { SetPowerTargetRequest as _braiins_bos_v1_SetPowerTargetRequest, SetPowerTargetRequest__Output as _braiins_bos_v1_SetPowerTargetRequest__Output } from '../../../braiins/bos/v1/SetPowerTargetRequest';
import type { SetPowerTargetResponse as _braiins_bos_v1_SetPowerTargetResponse, SetPowerTargetResponse__Output as _braiins_bos_v1_SetPowerTargetResponse__Output } from '../../../braiins/bos/v1/SetPowerTargetResponse';
import type { SetQuickRampingRequest as _braiins_bos_v1_SetQuickRampingRequest, SetQuickRampingRequest__Output as _braiins_bos_v1_SetQuickRampingRequest__Output } from '../../../braiins/bos/v1/SetQuickRampingRequest';
import type { SetRelativeTargetRequest as _braiins_bos_v1_SetRelativeTargetRequest, SetRelativeTargetRequest__Output as _braiins_bos_v1_SetRelativeTargetRequest__Output } from '../../../braiins/bos/v1/SetRelativeTargetRequest';

export interface PerformanceServiceClient extends grpc.Client {
  DecrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  DecrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  DecrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  DecrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementHashrateTarget(argument: _braiins_bos_v1_DecrementHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  
  DecrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  DecrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  DecrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  DecrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  decrementPowerTarget(argument: _braiins_bos_v1_DecrementPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  
  GetActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  GetActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  GetActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  GetActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  getActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  getActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  getActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  getActivePerformanceMode(argument: _braiins_bos_v1_GetPerformanceModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  
  GetMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  GetMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  GetMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  GetMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  getMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  getMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  getMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  getMinerEfficiencyProfile(argument: _braiins_bos_v1_GetMinerEfficiencyProfileRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>): grpc.ClientUnaryCall;
  
  GetTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  GetTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  GetTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  GetTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  getTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  getTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  getTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  getTunerState(argument: _braiins_bos_v1_GetTunerStateRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetTunerStateResponse__Output>): grpc.ClientUnaryCall;
  
  IncrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  IncrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  IncrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  IncrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementHashrateTarget(argument: _braiins_bos_v1_IncrementHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  
  IncrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  IncrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  IncrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  IncrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  incrementPowerTarget(argument: _braiins_bos_v1_IncrementPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  
  ListTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  ListTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  ListTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  ListTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  listTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  listTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  listTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  listTargetProfiles(argument: _braiins_bos_v1_ListTargetProfilesRequest, callback: grpc.requestCallback<_braiins_bos_v1_ListTargetProfilesResponse__Output>): grpc.ClientUnaryCall;
  
  RemoveTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  RemoveTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  RemoveTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  RemoveTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  removeTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  removeTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  removeTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  removeTunedProfiles(argument: _braiins_bos_v1_RemoveTunedProfilesRequest, callback: grpc.requestCallback<_braiins_bos_v1_RemoveTunedProfilesResponse__Output>): grpc.ClientUnaryCall;
  
  SetDPS(argument: _braiins_bos_v1_SetDPSRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  SetDPS(argument: _braiins_bos_v1_SetDPSRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  SetDPS(argument: _braiins_bos_v1_SetDPSRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  SetDPS(argument: _braiins_bos_v1_SetDPSRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  setDps(argument: _braiins_bos_v1_SetDPSRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  setDps(argument: _braiins_bos_v1_SetDPSRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  setDps(argument: _braiins_bos_v1_SetDPSRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  setDps(argument: _braiins_bos_v1_SetDPSRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetDPSResponse__Output>): grpc.ClientUnaryCall;
  
  SetDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultHashrateTarget(argument: _braiins_bos_v1_SetDefaultHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  
  SetDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setDefaultPowerTarget(argument: _braiins_bos_v1_SetDefaultPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  
  SetDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  SetDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setDefaultQuickRamping(argument: _braiins_bos_v1_SetDefaultQuickRampingRequest, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  
  SetHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setHashrateTarget(argument: _braiins_bos_v1_SetHashrateTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  
  SetPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  SetPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  SetPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  SetPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  setPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  setPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  setPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  setPerformanceMode(argument: _braiins_bos_v1_SetPerformanceModeRequest, callback: grpc.requestCallback<_braiins_bos_v1_PerformanceMode__Output>): grpc.ClientUnaryCall;
  
  SetPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setPowerTarget(argument: _braiins_bos_v1_SetPowerTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  
  SetQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  SetQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  SetQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  SetQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  setQuickRamping(argument: _braiins_bos_v1_SetQuickRampingRequest, callback: grpc.requestCallback<_braiins_bos_v1_QuickRampingResponse__Output>): grpc.ClientUnaryCall;
  
  SetRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  SetRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativeHashrateTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetHashrateTargetResponse__Output>): grpc.ClientUnaryCall;
  
  SetRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  SetRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  setRelativePowerTarget(argument: _braiins_bos_v1_SetRelativeTargetRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetPowerTargetResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface PerformanceServiceHandlers extends grpc.UntypedServiceImplementation {
  DecrementHashrateTarget: grpc.handleUnaryCall<_braiins_bos_v1_DecrementHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse>;
  
  DecrementPowerTarget: grpc.handleUnaryCall<_braiins_bos_v1_DecrementPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse>;
  
  GetActivePerformanceMode: grpc.handleUnaryCall<_braiins_bos_v1_GetPerformanceModeRequest__Output, _braiins_bos_v1_PerformanceMode>;
  
  GetMinerEfficiencyProfile: grpc.handleUnaryCall<_braiins_bos_v1_GetMinerEfficiencyProfileRequest__Output, _braiins_bos_v1_GetMinerEfficiencyProfileResponse>;
  
  GetTunerState: grpc.handleUnaryCall<_braiins_bos_v1_GetTunerStateRequest__Output, _braiins_bos_v1_GetTunerStateResponse>;
  
  IncrementHashrateTarget: grpc.handleUnaryCall<_braiins_bos_v1_IncrementHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse>;
  
  IncrementPowerTarget: grpc.handleUnaryCall<_braiins_bos_v1_IncrementPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse>;
  
  ListTargetProfiles: grpc.handleUnaryCall<_braiins_bos_v1_ListTargetProfilesRequest__Output, _braiins_bos_v1_ListTargetProfilesResponse>;
  
  RemoveTunedProfiles: grpc.handleUnaryCall<_braiins_bos_v1_RemoveTunedProfilesRequest__Output, _braiins_bos_v1_RemoveTunedProfilesResponse>;
  
  SetDPS: grpc.handleUnaryCall<_braiins_bos_v1_SetDPSRequest__Output, _braiins_bos_v1_SetDPSResponse>;
  
  SetDefaultHashrateTarget: grpc.handleUnaryCall<_braiins_bos_v1_SetDefaultHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse>;
  
  SetDefaultPowerTarget: grpc.handleUnaryCall<_braiins_bos_v1_SetDefaultPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse>;
  
  SetDefaultQuickRamping: grpc.handleUnaryCall<_braiins_bos_v1_SetDefaultQuickRampingRequest__Output, _braiins_bos_v1_QuickRampingResponse>;
  
  SetHashrateTarget: grpc.handleUnaryCall<_braiins_bos_v1_SetHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse>;
  
  SetPerformanceMode: grpc.handleUnaryCall<_braiins_bos_v1_SetPerformanceModeRequest__Output, _braiins_bos_v1_PerformanceMode>;
  
  SetPowerTarget: grpc.handleUnaryCall<_braiins_bos_v1_SetPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse>;
  
  SetQuickRamping: grpc.handleUnaryCall<_braiins_bos_v1_SetQuickRampingRequest__Output, _braiins_bos_v1_QuickRampingResponse>;
  
  SetRelativeHashrateTarget: grpc.handleUnaryCall<_braiins_bos_v1_SetRelativeTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse>;
  
  SetRelativePowerTarget: grpc.handleUnaryCall<_braiins_bos_v1_SetRelativeTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse>;
  
}

export interface PerformanceServiceDefinition extends grpc.ServiceDefinition {
  DecrementHashrateTarget: MethodDefinition<_braiins_bos_v1_DecrementHashrateTargetRequest, _braiins_bos_v1_SetHashrateTargetResponse, _braiins_bos_v1_DecrementHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse__Output>
  DecrementPowerTarget: MethodDefinition<_braiins_bos_v1_DecrementPowerTargetRequest, _braiins_bos_v1_SetPowerTargetResponse, _braiins_bos_v1_DecrementPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse__Output>
  GetActivePerformanceMode: MethodDefinition<_braiins_bos_v1_GetPerformanceModeRequest, _braiins_bos_v1_PerformanceMode, _braiins_bos_v1_GetPerformanceModeRequest__Output, _braiins_bos_v1_PerformanceMode__Output>
  GetMinerEfficiencyProfile: MethodDefinition<_braiins_bos_v1_GetMinerEfficiencyProfileRequest, _braiins_bos_v1_GetMinerEfficiencyProfileResponse, _braiins_bos_v1_GetMinerEfficiencyProfileRequest__Output, _braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>
  GetTunerState: MethodDefinition<_braiins_bos_v1_GetTunerStateRequest, _braiins_bos_v1_GetTunerStateResponse, _braiins_bos_v1_GetTunerStateRequest__Output, _braiins_bos_v1_GetTunerStateResponse__Output>
  IncrementHashrateTarget: MethodDefinition<_braiins_bos_v1_IncrementHashrateTargetRequest, _braiins_bos_v1_SetHashrateTargetResponse, _braiins_bos_v1_IncrementHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse__Output>
  IncrementPowerTarget: MethodDefinition<_braiins_bos_v1_IncrementPowerTargetRequest, _braiins_bos_v1_SetPowerTargetResponse, _braiins_bos_v1_IncrementPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse__Output>
  ListTargetProfiles: MethodDefinition<_braiins_bos_v1_ListTargetProfilesRequest, _braiins_bos_v1_ListTargetProfilesResponse, _braiins_bos_v1_ListTargetProfilesRequest__Output, _braiins_bos_v1_ListTargetProfilesResponse__Output>
  RemoveTunedProfiles: MethodDefinition<_braiins_bos_v1_RemoveTunedProfilesRequest, _braiins_bos_v1_RemoveTunedProfilesResponse, _braiins_bos_v1_RemoveTunedProfilesRequest__Output, _braiins_bos_v1_RemoveTunedProfilesResponse__Output>
  SetDPS: MethodDefinition<_braiins_bos_v1_SetDPSRequest, _braiins_bos_v1_SetDPSResponse, _braiins_bos_v1_SetDPSRequest__Output, _braiins_bos_v1_SetDPSResponse__Output>
  SetDefaultHashrateTarget: MethodDefinition<_braiins_bos_v1_SetDefaultHashrateTargetRequest, _braiins_bos_v1_SetHashrateTargetResponse, _braiins_bos_v1_SetDefaultHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse__Output>
  SetDefaultPowerTarget: MethodDefinition<_braiins_bos_v1_SetDefaultPowerTargetRequest, _braiins_bos_v1_SetPowerTargetResponse, _braiins_bos_v1_SetDefaultPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse__Output>
  SetDefaultQuickRamping: MethodDefinition<_braiins_bos_v1_SetDefaultQuickRampingRequest, _braiins_bos_v1_QuickRampingResponse, _braiins_bos_v1_SetDefaultQuickRampingRequest__Output, _braiins_bos_v1_QuickRampingResponse__Output>
  SetHashrateTarget: MethodDefinition<_braiins_bos_v1_SetHashrateTargetRequest, _braiins_bos_v1_SetHashrateTargetResponse, _braiins_bos_v1_SetHashrateTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse__Output>
  SetPerformanceMode: MethodDefinition<_braiins_bos_v1_SetPerformanceModeRequest, _braiins_bos_v1_PerformanceMode, _braiins_bos_v1_SetPerformanceModeRequest__Output, _braiins_bos_v1_PerformanceMode__Output>
  SetPowerTarget: MethodDefinition<_braiins_bos_v1_SetPowerTargetRequest, _braiins_bos_v1_SetPowerTargetResponse, _braiins_bos_v1_SetPowerTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse__Output>
  SetQuickRamping: MethodDefinition<_braiins_bos_v1_SetQuickRampingRequest, _braiins_bos_v1_QuickRampingResponse, _braiins_bos_v1_SetQuickRampingRequest__Output, _braiins_bos_v1_QuickRampingResponse__Output>
  SetRelativeHashrateTarget: MethodDefinition<_braiins_bos_v1_SetRelativeTargetRequest, _braiins_bos_v1_SetHashrateTargetResponse, _braiins_bos_v1_SetRelativeTargetRequest__Output, _braiins_bos_v1_SetHashrateTargetResponse__Output>
  SetRelativePowerTarget: MethodDefinition<_braiins_bos_v1_SetRelativeTargetRequest, _braiins_bos_v1_SetPowerTargetResponse, _braiins_bos_v1_SetRelativeTargetRequest__Output, _braiins_bos_v1_SetPowerTargetResponse__Output>
}
