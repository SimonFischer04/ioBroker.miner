import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AutoPauseMode as _braiins_bos_v1_AutoPauseMode, AutoPauseMode__Output as _braiins_bos_v1_AutoPauseMode__Output } from './braiins/bos/v1/AutoPauseMode';
import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from './braiins/bos/v1/BasesPoints';
import type { BooleanConstraint as _braiins_bos_v1_BooleanConstraint, BooleanConstraint__Output as _braiins_bos_v1_BooleanConstraint__Output } from './braiins/bos/v1/BooleanConstraint';
import type { ConfigurationServiceClient as _braiins_bos_v1_ConfigurationServiceClient, ConfigurationServiceDefinition as _braiins_bos_v1_ConfigurationServiceDefinition } from './braiins/bos/v1/ConfigurationService';
import type { CoolingAutoMode as _braiins_bos_v1_CoolingAutoMode, CoolingAutoMode__Output as _braiins_bos_v1_CoolingAutoMode__Output } from './braiins/bos/v1/CoolingAutoMode';
import type { CoolingConfiguration as _braiins_bos_v1_CoolingConfiguration, CoolingConfiguration__Output as _braiins_bos_v1_CoolingConfiguration__Output } from './braiins/bos/v1/CoolingConfiguration';
import type { CoolingConstraints as _braiins_bos_v1_CoolingConstraints, CoolingConstraints__Output as _braiins_bos_v1_CoolingConstraints__Output } from './braiins/bos/v1/CoolingConstraints';
import type { CoolingDisabledMode as _braiins_bos_v1_CoolingDisabledMode, CoolingDisabledMode__Output as _braiins_bos_v1_CoolingDisabledMode__Output } from './braiins/bos/v1/CoolingDisabledMode';
import type { CoolingHydroMode as _braiins_bos_v1_CoolingHydroMode, CoolingHydroMode__Output as _braiins_bos_v1_CoolingHydroMode__Output } from './braiins/bos/v1/CoolingHydroMode';
import type { CoolingImmersionMode as _braiins_bos_v1_CoolingImmersionMode, CoolingImmersionMode__Output as _braiins_bos_v1_CoolingImmersionMode__Output } from './braiins/bos/v1/CoolingImmersionMode';
import type { CoolingManualMode as _braiins_bos_v1_CoolingManualMode, CoolingManualMode__Output as _braiins_bos_v1_CoolingManualMode__Output } from './braiins/bos/v1/CoolingManualMode';
import type { CoolingServiceClient as _braiins_bos_v1_CoolingServiceClient, CoolingServiceDefinition as _braiins_bos_v1_CoolingServiceDefinition } from './braiins/bos/v1/CoolingService';
import type { CreatePoolGroupRequest as _braiins_bos_v1_CreatePoolGroupRequest, CreatePoolGroupRequest__Output as _braiins_bos_v1_CreatePoolGroupRequest__Output } from './braiins/bos/v1/CreatePoolGroupRequest';
import type { CreatePoolGroupResponse as _braiins_bos_v1_CreatePoolGroupResponse, CreatePoolGroupResponse__Output as _braiins_bos_v1_CreatePoolGroupResponse__Output } from './braiins/bos/v1/CreatePoolGroupResponse';
import type { DPSConfiguration as _braiins_bos_v1_DPSConfiguration, DPSConfiguration__Output as _braiins_bos_v1_DPSConfiguration__Output } from './braiins/bos/v1/DPSConfiguration';
import type { DPSConstraints as _braiins_bos_v1_DPSConstraints, DPSConstraints__Output as _braiins_bos_v1_DPSConstraints__Output } from './braiins/bos/v1/DPSConstraints';
import type { DPSHashrateTarget as _braiins_bos_v1_DPSHashrateTarget, DPSHashrateTarget__Output as _braiins_bos_v1_DPSHashrateTarget__Output } from './braiins/bos/v1/DPSHashrateTarget';
import type { DPSPowerTarget as _braiins_bos_v1_DPSPowerTarget, DPSPowerTarget__Output as _braiins_bos_v1_DPSPowerTarget__Output } from './braiins/bos/v1/DPSPowerTarget';
import type { DPSTarget as _braiins_bos_v1_DPSTarget, DPSTarget__Output as _braiins_bos_v1_DPSTarget__Output } from './braiins/bos/v1/DPSTarget';
import type { DecrementHashrateTargetRequest as _braiins_bos_v1_DecrementHashrateTargetRequest, DecrementHashrateTargetRequest__Output as _braiins_bos_v1_DecrementHashrateTargetRequest__Output } from './braiins/bos/v1/DecrementHashrateTargetRequest';
import type { DecrementPowerTargetRequest as _braiins_bos_v1_DecrementPowerTargetRequest, DecrementPowerTargetRequest__Output as _braiins_bos_v1_DecrementPowerTargetRequest__Output } from './braiins/bos/v1/DecrementPowerTargetRequest';
import type { DoubleConstraints as _braiins_bos_v1_DoubleConstraints, DoubleConstraints__Output as _braiins_bos_v1_DoubleConstraints__Output } from './braiins/bos/v1/DoubleConstraints';
import type { DurationConstraints as _braiins_bos_v1_DurationConstraints, DurationConstraints__Output as _braiins_bos_v1_DurationConstraints__Output } from './braiins/bos/v1/DurationConstraints';
import type { FanState as _braiins_bos_v1_FanState, FanState__Output as _braiins_bos_v1_FanState__Output } from './braiins/bos/v1/FanState';
import type { FixedShareRatio as _braiins_bos_v1_FixedShareRatio, FixedShareRatio__Output as _braiins_bos_v1_FixedShareRatio__Output } from './braiins/bos/v1/FixedShareRatio';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from './braiins/bos/v1/Frequency';
import type { FrequencyConstraints as _braiins_bos_v1_FrequencyConstraints, FrequencyConstraints__Output as _braiins_bos_v1_FrequencyConstraints__Output } from './braiins/bos/v1/FrequencyConstraints';
import type { GetConstraintsRequest as _braiins_bos_v1_GetConstraintsRequest, GetConstraintsRequest__Output as _braiins_bos_v1_GetConstraintsRequest__Output } from './braiins/bos/v1/GetConstraintsRequest';
import type { GetConstraintsResponse as _braiins_bos_v1_GetConstraintsResponse, GetConstraintsResponse__Output as _braiins_bos_v1_GetConstraintsResponse__Output } from './braiins/bos/v1/GetConstraintsResponse';
import type { GetCoolingStateRequest as _braiins_bos_v1_GetCoolingStateRequest, GetCoolingStateRequest__Output as _braiins_bos_v1_GetCoolingStateRequest__Output } from './braiins/bos/v1/GetCoolingStateRequest';
import type { GetCoolingStateResponse as _braiins_bos_v1_GetCoolingStateResponse, GetCoolingStateResponse__Output as _braiins_bos_v1_GetCoolingStateResponse__Output } from './braiins/bos/v1/GetCoolingStateResponse';
import type { GetMinerConfigurationRequest as _braiins_bos_v1_GetMinerConfigurationRequest, GetMinerConfigurationRequest__Output as _braiins_bos_v1_GetMinerConfigurationRequest__Output } from './braiins/bos/v1/GetMinerConfigurationRequest';
import type { GetMinerConfigurationResponse as _braiins_bos_v1_GetMinerConfigurationResponse, GetMinerConfigurationResponse__Output as _braiins_bos_v1_GetMinerConfigurationResponse__Output } from './braiins/bos/v1/GetMinerConfigurationResponse';
import type { GetMinerEfficiencyProfileRequest as _braiins_bos_v1_GetMinerEfficiencyProfileRequest, GetMinerEfficiencyProfileRequest__Output as _braiins_bos_v1_GetMinerEfficiencyProfileRequest__Output } from './braiins/bos/v1/GetMinerEfficiencyProfileRequest';
import type { GetMinerEfficiencyProfileResponse as _braiins_bos_v1_GetMinerEfficiencyProfileResponse, GetMinerEfficiencyProfileResponse__Output as _braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output } from './braiins/bos/v1/GetMinerEfficiencyProfileResponse';
import type { GetPerformanceModeRequest as _braiins_bos_v1_GetPerformanceModeRequest, GetPerformanceModeRequest__Output as _braiins_bos_v1_GetPerformanceModeRequest__Output } from './braiins/bos/v1/GetPerformanceModeRequest';
import type { GetPoolGroupsRequest as _braiins_bos_v1_GetPoolGroupsRequest, GetPoolGroupsRequest__Output as _braiins_bos_v1_GetPoolGroupsRequest__Output } from './braiins/bos/v1/GetPoolGroupsRequest';
import type { GetPoolGroupsResponse as _braiins_bos_v1_GetPoolGroupsResponse, GetPoolGroupsResponse__Output as _braiins_bos_v1_GetPoolGroupsResponse__Output } from './braiins/bos/v1/GetPoolGroupsResponse';
import type { GetTunerStateRequest as _braiins_bos_v1_GetTunerStateRequest, GetTunerStateRequest__Output as _braiins_bos_v1_GetTunerStateRequest__Output } from './braiins/bos/v1/GetTunerStateRequest';
import type { GetTunerStateResponse as _braiins_bos_v1_GetTunerStateResponse, GetTunerStateResponse__Output as _braiins_bos_v1_GetTunerStateResponse__Output } from './braiins/bos/v1/GetTunerStateResponse';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from './braiins/bos/v1/GigaHashrate';
import type { HashboardConfig as _braiins_bos_v1_HashboardConfig, HashboardConfig__Output as _braiins_bos_v1_HashboardConfig__Output } from './braiins/bos/v1/HashboardConfig';
import type { HashboardConstraints as _braiins_bos_v1_HashboardConstraints, HashboardConstraints__Output as _braiins_bos_v1_HashboardConstraints__Output } from './braiins/bos/v1/HashboardConstraints';
import type { HashboardPerformanceConfiguration as _braiins_bos_v1_HashboardPerformanceConfiguration, HashboardPerformanceConfiguration__Output as _braiins_bos_v1_HashboardPerformanceConfiguration__Output } from './braiins/bos/v1/HashboardPerformanceConfiguration';
import type { HashboardPerformanceSettings as _braiins_bos_v1_HashboardPerformanceSettings, HashboardPerformanceSettings__Output as _braiins_bos_v1_HashboardPerformanceSettings__Output } from './braiins/bos/v1/HashboardPerformanceSettings';
import type { HashrateConstraints as _braiins_bos_v1_HashrateConstraints, HashrateConstraints__Output as _braiins_bos_v1_HashrateConstraints__Output } from './braiins/bos/v1/HashrateConstraints';
import type { HashrateTargetMode as _braiins_bos_v1_HashrateTargetMode, HashrateTargetMode__Output as _braiins_bos_v1_HashrateTargetMode__Output } from './braiins/bos/v1/HashrateTargetMode';
import type { HashrateTargetModeState as _braiins_bos_v1_HashrateTargetModeState, HashrateTargetModeState__Output as _braiins_bos_v1_HashrateTargetModeState__Output } from './braiins/bos/v1/HashrateTargetModeState';
import type { HashrateTargetProfile as _braiins_bos_v1_HashrateTargetProfile, HashrateTargetProfile__Output as _braiins_bos_v1_HashrateTargetProfile__Output } from './braiins/bos/v1/HashrateTargetProfile';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from './braiins/bos/v1/Hours';
import type { IncrementHashrateTargetRequest as _braiins_bos_v1_IncrementHashrateTargetRequest, IncrementHashrateTargetRequest__Output as _braiins_bos_v1_IncrementHashrateTargetRequest__Output } from './braiins/bos/v1/IncrementHashrateTargetRequest';
import type { IncrementPowerTargetRequest as _braiins_bos_v1_IncrementPowerTargetRequest, IncrementPowerTargetRequest__Output as _braiins_bos_v1_IncrementPowerTargetRequest__Output } from './braiins/bos/v1/IncrementPowerTargetRequest';
import type { ListTargetProfilesRequest as _braiins_bos_v1_ListTargetProfilesRequest, ListTargetProfilesRequest__Output as _braiins_bos_v1_ListTargetProfilesRequest__Output } from './braiins/bos/v1/ListTargetProfilesRequest';
import type { ListTargetProfilesResponse as _braiins_bos_v1_ListTargetProfilesResponse, ListTargetProfilesResponse__Output as _braiins_bos_v1_ListTargetProfilesResponse__Output } from './braiins/bos/v1/ListTargetProfilesResponse';
import type { ManualPauseMode as _braiins_bos_v1_ManualPauseMode, ManualPauseMode__Output as _braiins_bos_v1_ManualPauseMode__Output } from './braiins/bos/v1/ManualPauseMode';
import type { ManualPerformanceMode as _braiins_bos_v1_ManualPerformanceMode, ManualPerformanceMode__Output as _braiins_bos_v1_ManualPerformanceMode__Output } from './braiins/bos/v1/ManualPerformanceMode';
import type { MegaHashrate as _braiins_bos_v1_MegaHashrate, MegaHashrate__Output as _braiins_bos_v1_MegaHashrate__Output } from './braiins/bos/v1/MegaHashrate';
import type { MinerEfficiencyPoint as _braiins_bos_v1_MinerEfficiencyPoint, MinerEfficiencyPoint__Output as _braiins_bos_v1_MinerEfficiencyPoint__Output } from './braiins/bos/v1/MinerEfficiencyPoint';
import type { PauseMode as _braiins_bos_v1_PauseMode, PauseMode__Output as _braiins_bos_v1_PauseMode__Output } from './braiins/bos/v1/PauseMode';
import type { PerformanceMode as _braiins_bos_v1_PerformanceMode, PerformanceMode__Output as _braiins_bos_v1_PerformanceMode__Output } from './braiins/bos/v1/PerformanceMode';
import type { PerformanceServiceClient as _braiins_bos_v1_PerformanceServiceClient, PerformanceServiceDefinition as _braiins_bos_v1_PerformanceServiceDefinition } from './braiins/bos/v1/PerformanceService';
import type { Pool as _braiins_bos_v1_Pool, Pool__Output as _braiins_bos_v1_Pool__Output } from './braiins/bos/v1/Pool';
import type { PoolConfiguration as _braiins_bos_v1_PoolConfiguration, PoolConfiguration__Output as _braiins_bos_v1_PoolConfiguration__Output } from './braiins/bos/v1/PoolConfiguration';
import type { PoolGroup as _braiins_bos_v1_PoolGroup, PoolGroup__Output as _braiins_bos_v1_PoolGroup__Output } from './braiins/bos/v1/PoolGroup';
import type { PoolGroupConfiguration as _braiins_bos_v1_PoolGroupConfiguration, PoolGroupConfiguration__Output as _braiins_bos_v1_PoolGroupConfiguration__Output } from './braiins/bos/v1/PoolGroupConfiguration';
import type { PoolServiceClient as _braiins_bos_v1_PoolServiceClient, PoolServiceDefinition as _braiins_bos_v1_PoolServiceDefinition } from './braiins/bos/v1/PoolService';
import type { PoolStats as _braiins_bos_v1_PoolStats, PoolStats__Output as _braiins_bos_v1_PoolStats__Output } from './braiins/bos/v1/PoolStats';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from './braiins/bos/v1/Power';
import type { PowerConstraints as _braiins_bos_v1_PowerConstraints, PowerConstraints__Output as _braiins_bos_v1_PowerConstraints__Output } from './braiins/bos/v1/PowerConstraints';
import type { PowerEfficiency as _braiins_bos_v1_PowerEfficiency, PowerEfficiency__Output as _braiins_bos_v1_PowerEfficiency__Output } from './braiins/bos/v1/PowerEfficiency';
import type { PowerTargetMode as _braiins_bos_v1_PowerTargetMode, PowerTargetMode__Output as _braiins_bos_v1_PowerTargetMode__Output } from './braiins/bos/v1/PowerTargetMode';
import type { PowerTargetModeState as _braiins_bos_v1_PowerTargetModeState, PowerTargetModeState__Output as _braiins_bos_v1_PowerTargetModeState__Output } from './braiins/bos/v1/PowerTargetModeState';
import type { PowerTargetProfile as _braiins_bos_v1_PowerTargetProfile, PowerTargetProfile__Output as _braiins_bos_v1_PowerTargetProfile__Output } from './braiins/bos/v1/PowerTargetProfile';
import type { QuickRampingResponse as _braiins_bos_v1_QuickRampingResponse, QuickRampingResponse__Output as _braiins_bos_v1_QuickRampingResponse__Output } from './braiins/bos/v1/QuickRampingResponse';
import type { Quota as _braiins_bos_v1_Quota, Quota__Output as _braiins_bos_v1_Quota__Output } from './braiins/bos/v1/Quota';
import type { RemovePoolGroupRequest as _braiins_bos_v1_RemovePoolGroupRequest, RemovePoolGroupRequest__Output as _braiins_bos_v1_RemovePoolGroupRequest__Output } from './braiins/bos/v1/RemovePoolGroupRequest';
import type { RemovePoolGroupResponse as _braiins_bos_v1_RemovePoolGroupResponse, RemovePoolGroupResponse__Output as _braiins_bos_v1_RemovePoolGroupResponse__Output } from './braiins/bos/v1/RemovePoolGroupResponse';
import type { RemoveTunedProfilesRequest as _braiins_bos_v1_RemoveTunedProfilesRequest, RemoveTunedProfilesRequest__Output as _braiins_bos_v1_RemoveTunedProfilesRequest__Output } from './braiins/bos/v1/RemoveTunedProfilesRequest';
import type { RemoveTunedProfilesResponse as _braiins_bos_v1_RemoveTunedProfilesResponse, RemoveTunedProfilesResponse__Output as _braiins_bos_v1_RemoveTunedProfilesResponse__Output } from './braiins/bos/v1/RemoveTunedProfilesResponse';
import type { SetCoolingModeRequest as _braiins_bos_v1_SetCoolingModeRequest, SetCoolingModeRequest__Output as _braiins_bos_v1_SetCoolingModeRequest__Output } from './braiins/bos/v1/SetCoolingModeRequest';
import type { SetCoolingModeResponse as _braiins_bos_v1_SetCoolingModeResponse, SetCoolingModeResponse__Output as _braiins_bos_v1_SetCoolingModeResponse__Output } from './braiins/bos/v1/SetCoolingModeResponse';
import type { SetDPSRequest as _braiins_bos_v1_SetDPSRequest, SetDPSRequest__Output as _braiins_bos_v1_SetDPSRequest__Output } from './braiins/bos/v1/SetDPSRequest';
import type { SetDPSResponse as _braiins_bos_v1_SetDPSResponse, SetDPSResponse__Output as _braiins_bos_v1_SetDPSResponse__Output } from './braiins/bos/v1/SetDPSResponse';
import type { SetDefaultHashrateTargetRequest as _braiins_bos_v1_SetDefaultHashrateTargetRequest, SetDefaultHashrateTargetRequest__Output as _braiins_bos_v1_SetDefaultHashrateTargetRequest__Output } from './braiins/bos/v1/SetDefaultHashrateTargetRequest';
import type { SetDefaultPowerTargetRequest as _braiins_bos_v1_SetDefaultPowerTargetRequest, SetDefaultPowerTargetRequest__Output as _braiins_bos_v1_SetDefaultPowerTargetRequest__Output } from './braiins/bos/v1/SetDefaultPowerTargetRequest';
import type { SetDefaultQuickRampingRequest as _braiins_bos_v1_SetDefaultQuickRampingRequest, SetDefaultQuickRampingRequest__Output as _braiins_bos_v1_SetDefaultQuickRampingRequest__Output } from './braiins/bos/v1/SetDefaultQuickRampingRequest';
import type { SetHashrateTargetRequest as _braiins_bos_v1_SetHashrateTargetRequest, SetHashrateTargetRequest__Output as _braiins_bos_v1_SetHashrateTargetRequest__Output } from './braiins/bos/v1/SetHashrateTargetRequest';
import type { SetHashrateTargetResponse as _braiins_bos_v1_SetHashrateTargetResponse, SetHashrateTargetResponse__Output as _braiins_bos_v1_SetHashrateTargetResponse__Output } from './braiins/bos/v1/SetHashrateTargetResponse';
import type { SetImmersionModeRequest as _braiins_bos_v1_SetImmersionModeRequest, SetImmersionModeRequest__Output as _braiins_bos_v1_SetImmersionModeRequest__Output } from './braiins/bos/v1/SetImmersionModeRequest';
import type { SetImmersionModeResponse as _braiins_bos_v1_SetImmersionModeResponse, SetImmersionModeResponse__Output as _braiins_bos_v1_SetImmersionModeResponse__Output } from './braiins/bos/v1/SetImmersionModeResponse';
import type { SetPerformanceModeRequest as _braiins_bos_v1_SetPerformanceModeRequest, SetPerformanceModeRequest__Output as _braiins_bos_v1_SetPerformanceModeRequest__Output } from './braiins/bos/v1/SetPerformanceModeRequest';
import type { SetPoolGroupsRequest as _braiins_bos_v1_SetPoolGroupsRequest, SetPoolGroupsRequest__Output as _braiins_bos_v1_SetPoolGroupsRequest__Output } from './braiins/bos/v1/SetPoolGroupsRequest';
import type { SetPoolGroupsResponse as _braiins_bos_v1_SetPoolGroupsResponse, SetPoolGroupsResponse__Output as _braiins_bos_v1_SetPoolGroupsResponse__Output } from './braiins/bos/v1/SetPoolGroupsResponse';
import type { SetPowerTargetRequest as _braiins_bos_v1_SetPowerTargetRequest, SetPowerTargetRequest__Output as _braiins_bos_v1_SetPowerTargetRequest__Output } from './braiins/bos/v1/SetPowerTargetRequest';
import type { SetPowerTargetResponse as _braiins_bos_v1_SetPowerTargetResponse, SetPowerTargetResponse__Output as _braiins_bos_v1_SetPowerTargetResponse__Output } from './braiins/bos/v1/SetPowerTargetResponse';
import type { SetQuickRampingRequest as _braiins_bos_v1_SetQuickRampingRequest, SetQuickRampingRequest__Output as _braiins_bos_v1_SetQuickRampingRequest__Output } from './braiins/bos/v1/SetQuickRampingRequest';
import type { SetRelativeTargetRequest as _braiins_bos_v1_SetRelativeTargetRequest, SetRelativeTargetRequest__Output as _braiins_bos_v1_SetRelativeTargetRequest__Output } from './braiins/bos/v1/SetRelativeTargetRequest';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from './braiins/bos/v1/Temperature';
import type { TemperatureConstraints as _braiins_bos_v1_TemperatureConstraints, TemperatureConstraints__Output as _braiins_bos_v1_TemperatureConstraints__Output } from './braiins/bos/v1/TemperatureConstraints';
import type { TemperatureSensor as _braiins_bos_v1_TemperatureSensor, TemperatureSensor__Output as _braiins_bos_v1_TemperatureSensor__Output } from './braiins/bos/v1/TemperatureSensor';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from './braiins/bos/v1/TeraHashrate';
import type { TunerConfiguration as _braiins_bos_v1_TunerConfiguration, TunerConfiguration__Output as _braiins_bos_v1_TunerConfiguration__Output } from './braiins/bos/v1/TunerConfiguration';
import type { TunerConstraints as _braiins_bos_v1_TunerConstraints, TunerConstraints__Output as _braiins_bos_v1_TunerConstraints__Output } from './braiins/bos/v1/TunerConstraints';
import type { TunerPerformanceMode as _braiins_bos_v1_TunerPerformanceMode, TunerPerformanceMode__Output as _braiins_bos_v1_TunerPerformanceMode__Output } from './braiins/bos/v1/TunerPerformanceMode';
import type { UInt32Constraints as _braiins_bos_v1_UInt32Constraints, UInt32Constraints__Output as _braiins_bos_v1_UInt32Constraints__Output } from './braiins/bos/v1/UInt32Constraints';
import type { UpdatePoolGroupRequest as _braiins_bos_v1_UpdatePoolGroupRequest, UpdatePoolGroupRequest__Output as _braiins_bos_v1_UpdatePoolGroupRequest__Output } from './braiins/bos/v1/UpdatePoolGroupRequest';
import type { UpdatePoolGroupResponse as _braiins_bos_v1_UpdatePoolGroupResponse, UpdatePoolGroupResponse__Output as _braiins_bos_v1_UpdatePoolGroupResponse__Output } from './braiins/bos/v1/UpdatePoolGroupResponse';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from './braiins/bos/v1/Voltage';
import type { VoltageConstraints as _braiins_bos_v1_VoltageConstraints, VoltageConstraints__Output as _braiins_bos_v1_VoltageConstraints__Output } from './braiins/bos/v1/VoltageConstraints';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        AutoPauseMode: MessageTypeDefinition<_braiins_bos_v1_AutoPauseMode, _braiins_bos_v1_AutoPauseMode__Output>
        BasesPoints: MessageTypeDefinition<_braiins_bos_v1_BasesPoints, _braiins_bos_v1_BasesPoints__Output>
        BooleanConstraint: MessageTypeDefinition<_braiins_bos_v1_BooleanConstraint, _braiins_bos_v1_BooleanConstraint__Output>
        ConfigurationService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_ConfigurationServiceClient> & { service: _braiins_bos_v1_ConfigurationServiceDefinition }
        CoolingAutoMode: MessageTypeDefinition<_braiins_bos_v1_CoolingAutoMode, _braiins_bos_v1_CoolingAutoMode__Output>
        CoolingConfiguration: MessageTypeDefinition<_braiins_bos_v1_CoolingConfiguration, _braiins_bos_v1_CoolingConfiguration__Output>
        CoolingConstraints: MessageTypeDefinition<_braiins_bos_v1_CoolingConstraints, _braiins_bos_v1_CoolingConstraints__Output>
        CoolingDisabledMode: MessageTypeDefinition<_braiins_bos_v1_CoolingDisabledMode, _braiins_bos_v1_CoolingDisabledMode__Output>
        CoolingHydroMode: MessageTypeDefinition<_braiins_bos_v1_CoolingHydroMode, _braiins_bos_v1_CoolingHydroMode__Output>
        CoolingImmersionMode: MessageTypeDefinition<_braiins_bos_v1_CoolingImmersionMode, _braiins_bos_v1_CoolingImmersionMode__Output>
        CoolingManualMode: MessageTypeDefinition<_braiins_bos_v1_CoolingManualMode, _braiins_bos_v1_CoolingManualMode__Output>
        CoolingMode: EnumTypeDefinition
        CoolingService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_CoolingServiceClient> & { service: _braiins_bos_v1_CoolingServiceDefinition }
        CreatePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_CreatePoolGroupRequest, _braiins_bos_v1_CreatePoolGroupRequest__Output>
        CreatePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_CreatePoolGroupResponse, _braiins_bos_v1_CreatePoolGroupResponse__Output>
        DPSConfiguration: MessageTypeDefinition<_braiins_bos_v1_DPSConfiguration, _braiins_bos_v1_DPSConfiguration__Output>
        DPSConstraints: MessageTypeDefinition<_braiins_bos_v1_DPSConstraints, _braiins_bos_v1_DPSConstraints__Output>
        DPSHashrateTarget: MessageTypeDefinition<_braiins_bos_v1_DPSHashrateTarget, _braiins_bos_v1_DPSHashrateTarget__Output>
        DPSMode: EnumTypeDefinition
        DPSPowerTarget: MessageTypeDefinition<_braiins_bos_v1_DPSPowerTarget, _braiins_bos_v1_DPSPowerTarget__Output>
        DPSTarget: MessageTypeDefinition<_braiins_bos_v1_DPSTarget, _braiins_bos_v1_DPSTarget__Output>
        DayOfWeek: EnumTypeDefinition
        DecrementHashrateTargetRequest: MessageTypeDefinition<_braiins_bos_v1_DecrementHashrateTargetRequest, _braiins_bos_v1_DecrementHashrateTargetRequest__Output>
        DecrementPowerTargetRequest: MessageTypeDefinition<_braiins_bos_v1_DecrementPowerTargetRequest, _braiins_bos_v1_DecrementPowerTargetRequest__Output>
        DoubleConstraints: MessageTypeDefinition<_braiins_bos_v1_DoubleConstraints, _braiins_bos_v1_DoubleConstraints__Output>
        DurationConstraints: MessageTypeDefinition<_braiins_bos_v1_DurationConstraints, _braiins_bos_v1_DurationConstraints__Output>
        FanPauseMode: EnumTypeDefinition
        FanPauseRuntime: EnumTypeDefinition
        FanState: MessageTypeDefinition<_braiins_bos_v1_FanState, _braiins_bos_v1_FanState__Output>
        FixedShareRatio: MessageTypeDefinition<_braiins_bos_v1_FixedShareRatio, _braiins_bos_v1_FixedShareRatio__Output>
        Frequency: MessageTypeDefinition<_braiins_bos_v1_Frequency, _braiins_bos_v1_Frequency__Output>
        FrequencyConstraints: MessageTypeDefinition<_braiins_bos_v1_FrequencyConstraints, _braiins_bos_v1_FrequencyConstraints__Output>
        GetConstraintsRequest: MessageTypeDefinition<_braiins_bos_v1_GetConstraintsRequest, _braiins_bos_v1_GetConstraintsRequest__Output>
        GetConstraintsResponse: MessageTypeDefinition<_braiins_bos_v1_GetConstraintsResponse, _braiins_bos_v1_GetConstraintsResponse__Output>
        GetCoolingStateRequest: MessageTypeDefinition<_braiins_bos_v1_GetCoolingStateRequest, _braiins_bos_v1_GetCoolingStateRequest__Output>
        GetCoolingStateResponse: MessageTypeDefinition<_braiins_bos_v1_GetCoolingStateResponse, _braiins_bos_v1_GetCoolingStateResponse__Output>
        GetMinerConfigurationRequest: MessageTypeDefinition<_braiins_bos_v1_GetMinerConfigurationRequest, _braiins_bos_v1_GetMinerConfigurationRequest__Output>
        GetMinerConfigurationResponse: MessageTypeDefinition<_braiins_bos_v1_GetMinerConfigurationResponse, _braiins_bos_v1_GetMinerConfigurationResponse__Output>
        GetMinerEfficiencyProfileRequest: MessageTypeDefinition<_braiins_bos_v1_GetMinerEfficiencyProfileRequest, _braiins_bos_v1_GetMinerEfficiencyProfileRequest__Output>
        GetMinerEfficiencyProfileResponse: MessageTypeDefinition<_braiins_bos_v1_GetMinerEfficiencyProfileResponse, _braiins_bos_v1_GetMinerEfficiencyProfileResponse__Output>
        GetPerformanceModeRequest: MessageTypeDefinition<_braiins_bos_v1_GetPerformanceModeRequest, _braiins_bos_v1_GetPerformanceModeRequest__Output>
        GetPoolGroupsRequest: MessageTypeDefinition<_braiins_bos_v1_GetPoolGroupsRequest, _braiins_bos_v1_GetPoolGroupsRequest__Output>
        GetPoolGroupsResponse: MessageTypeDefinition<_braiins_bos_v1_GetPoolGroupsResponse, _braiins_bos_v1_GetPoolGroupsResponse__Output>
        GetTunerStateRequest: MessageTypeDefinition<_braiins_bos_v1_GetTunerStateRequest, _braiins_bos_v1_GetTunerStateRequest__Output>
        GetTunerStateResponse: MessageTypeDefinition<_braiins_bos_v1_GetTunerStateResponse, _braiins_bos_v1_GetTunerStateResponse__Output>
        GigaHashrate: MessageTypeDefinition<_braiins_bos_v1_GigaHashrate, _braiins_bos_v1_GigaHashrate__Output>
        HashboardConfig: MessageTypeDefinition<_braiins_bos_v1_HashboardConfig, _braiins_bos_v1_HashboardConfig__Output>
        HashboardConstraints: MessageTypeDefinition<_braiins_bos_v1_HashboardConstraints, _braiins_bos_v1_HashboardConstraints__Output>
        HashboardPerformanceConfiguration: MessageTypeDefinition<_braiins_bos_v1_HashboardPerformanceConfiguration, _braiins_bos_v1_HashboardPerformanceConfiguration__Output>
        HashboardPerformanceSettings: MessageTypeDefinition<_braiins_bos_v1_HashboardPerformanceSettings, _braiins_bos_v1_HashboardPerformanceSettings__Output>
        HashrateConstraints: MessageTypeDefinition<_braiins_bos_v1_HashrateConstraints, _braiins_bos_v1_HashrateConstraints__Output>
        HashrateTargetMode: MessageTypeDefinition<_braiins_bos_v1_HashrateTargetMode, _braiins_bos_v1_HashrateTargetMode__Output>
        HashrateTargetModeState: MessageTypeDefinition<_braiins_bos_v1_HashrateTargetModeState, _braiins_bos_v1_HashrateTargetModeState__Output>
        HashrateTargetProfile: MessageTypeDefinition<_braiins_bos_v1_HashrateTargetProfile, _braiins_bos_v1_HashrateTargetProfile__Output>
        Hours: MessageTypeDefinition<_braiins_bos_v1_Hours, _braiins_bos_v1_Hours__Output>
        IncrementHashrateTargetRequest: MessageTypeDefinition<_braiins_bos_v1_IncrementHashrateTargetRequest, _braiins_bos_v1_IncrementHashrateTargetRequest__Output>
        IncrementPowerTargetRequest: MessageTypeDefinition<_braiins_bos_v1_IncrementPowerTargetRequest, _braiins_bos_v1_IncrementPowerTargetRequest__Output>
        ListTargetProfilesRequest: MessageTypeDefinition<_braiins_bos_v1_ListTargetProfilesRequest, _braiins_bos_v1_ListTargetProfilesRequest__Output>
        ListTargetProfilesResponse: MessageTypeDefinition<_braiins_bos_v1_ListTargetProfilesResponse, _braiins_bos_v1_ListTargetProfilesResponse__Output>
        ManualPauseMode: MessageTypeDefinition<_braiins_bos_v1_ManualPauseMode, _braiins_bos_v1_ManualPauseMode__Output>
        ManualPerformanceMode: MessageTypeDefinition<_braiins_bos_v1_ManualPerformanceMode, _braiins_bos_v1_ManualPerformanceMode__Output>
        MegaHashrate: MessageTypeDefinition<_braiins_bos_v1_MegaHashrate, _braiins_bos_v1_MegaHashrate__Output>
        MinerEfficiencyPoint: MessageTypeDefinition<_braiins_bos_v1_MinerEfficiencyPoint, _braiins_bos_v1_MinerEfficiencyPoint__Output>
        PauseMode: MessageTypeDefinition<_braiins_bos_v1_PauseMode, _braiins_bos_v1_PauseMode__Output>
        PerformanceMode: MessageTypeDefinition<_braiins_bos_v1_PerformanceMode, _braiins_bos_v1_PerformanceMode__Output>
        PerformanceService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_PerformanceServiceClient> & { service: _braiins_bos_v1_PerformanceServiceDefinition }
        Pool: MessageTypeDefinition<_braiins_bos_v1_Pool, _braiins_bos_v1_Pool__Output>
        PoolConfiguration: MessageTypeDefinition<_braiins_bos_v1_PoolConfiguration, _braiins_bos_v1_PoolConfiguration__Output>
        PoolGroup: MessageTypeDefinition<_braiins_bos_v1_PoolGroup, _braiins_bos_v1_PoolGroup__Output>
        PoolGroupConfiguration: MessageTypeDefinition<_braiins_bos_v1_PoolGroupConfiguration, _braiins_bos_v1_PoolGroupConfiguration__Output>
        PoolService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_PoolServiceClient> & { service: _braiins_bos_v1_PoolServiceDefinition }
        PoolStats: MessageTypeDefinition<_braiins_bos_v1_PoolStats, _braiins_bos_v1_PoolStats__Output>
        Power: MessageTypeDefinition<_braiins_bos_v1_Power, _braiins_bos_v1_Power__Output>
        PowerConstraints: MessageTypeDefinition<_braiins_bos_v1_PowerConstraints, _braiins_bos_v1_PowerConstraints__Output>
        PowerEfficiency: MessageTypeDefinition<_braiins_bos_v1_PowerEfficiency, _braiins_bos_v1_PowerEfficiency__Output>
        PowerTargetMode: MessageTypeDefinition<_braiins_bos_v1_PowerTargetMode, _braiins_bos_v1_PowerTargetMode__Output>
        PowerTargetModeState: MessageTypeDefinition<_braiins_bos_v1_PowerTargetModeState, _braiins_bos_v1_PowerTargetModeState__Output>
        PowerTargetProfile: MessageTypeDefinition<_braiins_bos_v1_PowerTargetProfile, _braiins_bos_v1_PowerTargetProfile__Output>
        QuickRampingResponse: MessageTypeDefinition<_braiins_bos_v1_QuickRampingResponse, _braiins_bos_v1_QuickRampingResponse__Output>
        Quota: MessageTypeDefinition<_braiins_bos_v1_Quota, _braiins_bos_v1_Quota__Output>
        RelativeTargetReference: EnumTypeDefinition
        RemovePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_RemovePoolGroupRequest, _braiins_bos_v1_RemovePoolGroupRequest__Output>
        RemovePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_RemovePoolGroupResponse, _braiins_bos_v1_RemovePoolGroupResponse__Output>
        RemoveTunedProfilesRequest: MessageTypeDefinition<_braiins_bos_v1_RemoveTunedProfilesRequest, _braiins_bos_v1_RemoveTunedProfilesRequest__Output>
        RemoveTunedProfilesResponse: MessageTypeDefinition<_braiins_bos_v1_RemoveTunedProfilesResponse, _braiins_bos_v1_RemoveTunedProfilesResponse__Output>
        SaveAction: EnumTypeDefinition
        SensorLocation: EnumTypeDefinition
        SetCoolingModeRequest: MessageTypeDefinition<_braiins_bos_v1_SetCoolingModeRequest, _braiins_bos_v1_SetCoolingModeRequest__Output>
        SetCoolingModeResponse: MessageTypeDefinition<_braiins_bos_v1_SetCoolingModeResponse, _braiins_bos_v1_SetCoolingModeResponse__Output>
        SetDPSRequest: MessageTypeDefinition<_braiins_bos_v1_SetDPSRequest, _braiins_bos_v1_SetDPSRequest__Output>
        SetDPSResponse: MessageTypeDefinition<_braiins_bos_v1_SetDPSResponse, _braiins_bos_v1_SetDPSResponse__Output>
        SetDefaultHashrateTargetRequest: MessageTypeDefinition<_braiins_bos_v1_SetDefaultHashrateTargetRequest, _braiins_bos_v1_SetDefaultHashrateTargetRequest__Output>
        SetDefaultPowerTargetRequest: MessageTypeDefinition<_braiins_bos_v1_SetDefaultPowerTargetRequest, _braiins_bos_v1_SetDefaultPowerTargetRequest__Output>
        SetDefaultQuickRampingRequest: MessageTypeDefinition<_braiins_bos_v1_SetDefaultQuickRampingRequest, _braiins_bos_v1_SetDefaultQuickRampingRequest__Output>
        SetHashrateTargetRequest: MessageTypeDefinition<_braiins_bos_v1_SetHashrateTargetRequest, _braiins_bos_v1_SetHashrateTargetRequest__Output>
        SetHashrateTargetResponse: MessageTypeDefinition<_braiins_bos_v1_SetHashrateTargetResponse, _braiins_bos_v1_SetHashrateTargetResponse__Output>
        SetImmersionModeRequest: MessageTypeDefinition<_braiins_bos_v1_SetImmersionModeRequest, _braiins_bos_v1_SetImmersionModeRequest__Output>
        SetImmersionModeResponse: MessageTypeDefinition<_braiins_bos_v1_SetImmersionModeResponse, _braiins_bos_v1_SetImmersionModeResponse__Output>
        SetPerformanceModeRequest: MessageTypeDefinition<_braiins_bos_v1_SetPerformanceModeRequest, _braiins_bos_v1_SetPerformanceModeRequest__Output>
        SetPoolGroupsRequest: MessageTypeDefinition<_braiins_bos_v1_SetPoolGroupsRequest, _braiins_bos_v1_SetPoolGroupsRequest__Output>
        SetPoolGroupsResponse: MessageTypeDefinition<_braiins_bos_v1_SetPoolGroupsResponse, _braiins_bos_v1_SetPoolGroupsResponse__Output>
        SetPowerTargetRequest: MessageTypeDefinition<_braiins_bos_v1_SetPowerTargetRequest, _braiins_bos_v1_SetPowerTargetRequest__Output>
        SetPowerTargetResponse: MessageTypeDefinition<_braiins_bos_v1_SetPowerTargetResponse, _braiins_bos_v1_SetPowerTargetResponse__Output>
        SetQuickRampingRequest: MessageTypeDefinition<_braiins_bos_v1_SetQuickRampingRequest, _braiins_bos_v1_SetQuickRampingRequest__Output>
        SetRelativeTargetRequest: MessageTypeDefinition<_braiins_bos_v1_SetRelativeTargetRequest, _braiins_bos_v1_SetRelativeTargetRequest__Output>
        Temperature: MessageTypeDefinition<_braiins_bos_v1_Temperature, _braiins_bos_v1_Temperature__Output>
        TemperatureConstraints: MessageTypeDefinition<_braiins_bos_v1_TemperatureConstraints, _braiins_bos_v1_TemperatureConstraints__Output>
        TemperatureSensor: MessageTypeDefinition<_braiins_bos_v1_TemperatureSensor, _braiins_bos_v1_TemperatureSensor__Output>
        TeraHashrate: MessageTypeDefinition<_braiins_bos_v1_TeraHashrate, _braiins_bos_v1_TeraHashrate__Output>
        TunerConfiguration: MessageTypeDefinition<_braiins_bos_v1_TunerConfiguration, _braiins_bos_v1_TunerConfiguration__Output>
        TunerConstraints: MessageTypeDefinition<_braiins_bos_v1_TunerConstraints, _braiins_bos_v1_TunerConstraints__Output>
        TunerMode: EnumTypeDefinition
        TunerPerformanceMode: MessageTypeDefinition<_braiins_bos_v1_TunerPerformanceMode, _braiins_bos_v1_TunerPerformanceMode__Output>
        TunerState: EnumTypeDefinition
        UInt32Constraints: MessageTypeDefinition<_braiins_bos_v1_UInt32Constraints, _braiins_bos_v1_UInt32Constraints__Output>
        UpdatePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_UpdatePoolGroupRequest, _braiins_bos_v1_UpdatePoolGroupRequest__Output>
        UpdatePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_UpdatePoolGroupResponse, _braiins_bos_v1_UpdatePoolGroupResponse__Output>
        Voltage: MessageTypeDefinition<_braiins_bos_v1_Voltage, _braiins_bos_v1_Voltage__Output>
        VoltageConstraints: MessageTypeDefinition<_braiins_bos_v1_VoltageConstraints, _braiins_bos_v1_VoltageConstraints__Output>
      }
    }
  }
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
    }
  }
}

