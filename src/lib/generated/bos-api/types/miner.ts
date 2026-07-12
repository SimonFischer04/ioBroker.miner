import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AutoPauseMode as _braiins_bos_v1_AutoPauseMode, AutoPauseMode__Output as _braiins_bos_v1_AutoPauseMode__Output } from './braiins/bos/v1/AutoPauseMode';
import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from './braiins/bos/v1/BasesPoints';
import type { BooleanConstraint as _braiins_bos_v1_BooleanConstraint, BooleanConstraint__Output as _braiins_bos_v1_BooleanConstraint__Output } from './braiins/bos/v1/BooleanConstraint';
import type { BosVersion as _braiins_bos_v1_BosVersion, BosVersion__Output as _braiins_bos_v1_BosVersion__Output } from './braiins/bos/v1/BosVersion';
import type { Component as _braiins_bos_v1_Component, Component__Output as _braiins_bos_v1_Component__Output } from './braiins/bos/v1/Component';
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
import type { DisableHashboardsRequest as _braiins_bos_v1_DisableHashboardsRequest, DisableHashboardsRequest__Output as _braiins_bos_v1_DisableHashboardsRequest__Output } from './braiins/bos/v1/DisableHashboardsRequest';
import type { DisableHashboardsResponse as _braiins_bos_v1_DisableHashboardsResponse, DisableHashboardsResponse__Output as _braiins_bos_v1_DisableHashboardsResponse__Output } from './braiins/bos/v1/DisableHashboardsResponse';
import type { DoubleConstraints as _braiins_bos_v1_DoubleConstraints, DoubleConstraints__Output as _braiins_bos_v1_DoubleConstraints__Output } from './braiins/bos/v1/DoubleConstraints';
import type { DurationConstraints as _braiins_bos_v1_DurationConstraints, DurationConstraints__Output as _braiins_bos_v1_DurationConstraints__Output } from './braiins/bos/v1/DurationConstraints';
import type { EnableHashboardsRequest as _braiins_bos_v1_EnableHashboardsRequest, EnableHashboardsRequest__Output as _braiins_bos_v1_EnableHashboardsRequest__Output } from './braiins/bos/v1/EnableHashboardsRequest';
import type { EnableHashboardsResponse as _braiins_bos_v1_EnableHashboardsResponse, EnableHashboardsResponse__Output as _braiins_bos_v1_EnableHashboardsResponse__Output } from './braiins/bos/v1/EnableHashboardsResponse';
import type { ErrorCode as _braiins_bos_v1_ErrorCode, ErrorCode__Output as _braiins_bos_v1_ErrorCode__Output } from './braiins/bos/v1/ErrorCode';
import type { FanState as _braiins_bos_v1_FanState, FanState__Output as _braiins_bos_v1_FanState__Output } from './braiins/bos/v1/FanState';
import type { FixedShareRatio as _braiins_bos_v1_FixedShareRatio, FixedShareRatio__Output as _braiins_bos_v1_FixedShareRatio__Output } from './braiins/bos/v1/FixedShareRatio';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from './braiins/bos/v1/Frequency';
import type { FrequencyConstraints as _braiins_bos_v1_FrequencyConstraints, FrequencyConstraints__Output as _braiins_bos_v1_FrequencyConstraints__Output } from './braiins/bos/v1/FrequencyConstraints';
import type { GetCoolingStateRequest as _braiins_bos_v1_GetCoolingStateRequest, GetCoolingStateRequest__Output as _braiins_bos_v1_GetCoolingStateRequest__Output } from './braiins/bos/v1/GetCoolingStateRequest';
import type { GetCoolingStateResponse as _braiins_bos_v1_GetCoolingStateResponse, GetCoolingStateResponse__Output as _braiins_bos_v1_GetCoolingStateResponse__Output } from './braiins/bos/v1/GetCoolingStateResponse';
import type { GetErrorsRequest as _braiins_bos_v1_GetErrorsRequest, GetErrorsRequest__Output as _braiins_bos_v1_GetErrorsRequest__Output } from './braiins/bos/v1/GetErrorsRequest';
import type { GetErrorsResponse as _braiins_bos_v1_GetErrorsResponse, GetErrorsResponse__Output as _braiins_bos_v1_GetErrorsResponse__Output } from './braiins/bos/v1/GetErrorsResponse';
import type { GetHashboardsRequest as _braiins_bos_v1_GetHashboardsRequest, GetHashboardsRequest__Output as _braiins_bos_v1_GetHashboardsRequest__Output } from './braiins/bos/v1/GetHashboardsRequest';
import type { GetHashboardsResponse as _braiins_bos_v1_GetHashboardsResponse, GetHashboardsResponse__Output as _braiins_bos_v1_GetHashboardsResponse__Output } from './braiins/bos/v1/GetHashboardsResponse';
import type { GetLogRequest as _braiins_bos_v1_GetLogRequest, GetLogRequest__Output as _braiins_bos_v1_GetLogRequest__Output } from './braiins/bos/v1/GetLogRequest';
import type { GetLogResponse as _braiins_bos_v1_GetLogResponse, GetLogResponse__Output as _braiins_bos_v1_GetLogResponse__Output } from './braiins/bos/v1/GetLogResponse';
import type { GetMinerDetailsRequest as _braiins_bos_v1_GetMinerDetailsRequest, GetMinerDetailsRequest__Output as _braiins_bos_v1_GetMinerDetailsRequest__Output } from './braiins/bos/v1/GetMinerDetailsRequest';
import type { GetMinerDetailsResponse as _braiins_bos_v1_GetMinerDetailsResponse, GetMinerDetailsResponse__Output as _braiins_bos_v1_GetMinerDetailsResponse__Output } from './braiins/bos/v1/GetMinerDetailsResponse';
import type { GetMinerStatsRequest as _braiins_bos_v1_GetMinerStatsRequest, GetMinerStatsRequest__Output as _braiins_bos_v1_GetMinerStatsRequest__Output } from './braiins/bos/v1/GetMinerStatsRequest';
import type { GetMinerStatsResponse as _braiins_bos_v1_GetMinerStatsResponse, GetMinerStatsResponse__Output as _braiins_bos_v1_GetMinerStatsResponse__Output } from './braiins/bos/v1/GetMinerStatsResponse';
import type { GetMinerStatusRequest as _braiins_bos_v1_GetMinerStatusRequest, GetMinerStatusRequest__Output as _braiins_bos_v1_GetMinerStatusRequest__Output } from './braiins/bos/v1/GetMinerStatusRequest';
import type { GetMinerStatusResponse as _braiins_bos_v1_GetMinerStatusResponse, GetMinerStatusResponse__Output as _braiins_bos_v1_GetMinerStatusResponse__Output } from './braiins/bos/v1/GetMinerStatusResponse';
import type { GetPoolGroupsRequest as _braiins_bos_v1_GetPoolGroupsRequest, GetPoolGroupsRequest__Output as _braiins_bos_v1_GetPoolGroupsRequest__Output } from './braiins/bos/v1/GetPoolGroupsRequest';
import type { GetPoolGroupsResponse as _braiins_bos_v1_GetPoolGroupsResponse, GetPoolGroupsResponse__Output as _braiins_bos_v1_GetPoolGroupsResponse__Output } from './braiins/bos/v1/GetPoolGroupsResponse';
import type { GetSupportArchiveRequest as _braiins_bos_v1_GetSupportArchiveRequest, GetSupportArchiveRequest__Output as _braiins_bos_v1_GetSupportArchiveRequest__Output } from './braiins/bos/v1/GetSupportArchiveRequest';
import type { GetSupportArchiveResponse as _braiins_bos_v1_GetSupportArchiveResponse, GetSupportArchiveResponse__Output as _braiins_bos_v1_GetSupportArchiveResponse__Output } from './braiins/bos/v1/GetSupportArchiveResponse';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from './braiins/bos/v1/GigaHashrate';
import type { Hashboard as _braiins_bos_v1_Hashboard, Hashboard__Output as _braiins_bos_v1_Hashboard__Output } from './braiins/bos/v1/Hashboard';
import type { HashboardEnableState as _braiins_bos_v1_HashboardEnableState, HashboardEnableState__Output as _braiins_bos_v1_HashboardEnableState__Output } from './braiins/bos/v1/HashboardEnableState';
import type { HashrateConstraints as _braiins_bos_v1_HashrateConstraints, HashrateConstraints__Output as _braiins_bos_v1_HashrateConstraints__Output } from './braiins/bos/v1/HashrateConstraints';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from './braiins/bos/v1/Hours';
import type { ManualPauseMode as _braiins_bos_v1_ManualPauseMode, ManualPauseMode__Output as _braiins_bos_v1_ManualPauseMode__Output } from './braiins/bos/v1/ManualPauseMode';
import type { MegaHashrate as _braiins_bos_v1_MegaHashrate, MegaHashrate__Output as _braiins_bos_v1_MegaHashrate__Output } from './braiins/bos/v1/MegaHashrate';
import type { MinerError as _braiins_bos_v1_MinerError, MinerError__Output as _braiins_bos_v1_MinerError__Output } from './braiins/bos/v1/MinerError';
import type { MinerIdentity as _braiins_bos_v1_MinerIdentity, MinerIdentity__Output as _braiins_bos_v1_MinerIdentity__Output } from './braiins/bos/v1/MinerIdentity';
import type { MinerPowerStats as _braiins_bos_v1_MinerPowerStats, MinerPowerStats__Output as _braiins_bos_v1_MinerPowerStats__Output } from './braiins/bos/v1/MinerPowerStats';
import type { MinerServiceClient as _braiins_bos_v1_MinerServiceClient, MinerServiceDefinition as _braiins_bos_v1_MinerServiceDefinition } from './braiins/bos/v1/MinerService';
import type { PauseMode as _braiins_bos_v1_PauseMode, PauseMode__Output as _braiins_bos_v1_PauseMode__Output } from './braiins/bos/v1/PauseMode';
import type { Pool as _braiins_bos_v1_Pool, Pool__Output as _braiins_bos_v1_Pool__Output } from './braiins/bos/v1/Pool';
import type { PoolConfiguration as _braiins_bos_v1_PoolConfiguration, PoolConfiguration__Output as _braiins_bos_v1_PoolConfiguration__Output } from './braiins/bos/v1/PoolConfiguration';
import type { PoolGroup as _braiins_bos_v1_PoolGroup, PoolGroup__Output as _braiins_bos_v1_PoolGroup__Output } from './braiins/bos/v1/PoolGroup';
import type { PoolGroupConfiguration as _braiins_bos_v1_PoolGroupConfiguration, PoolGroupConfiguration__Output as _braiins_bos_v1_PoolGroupConfiguration__Output } from './braiins/bos/v1/PoolGroupConfiguration';
import type { PoolServiceClient as _braiins_bos_v1_PoolServiceClient, PoolServiceDefinition as _braiins_bos_v1_PoolServiceDefinition } from './braiins/bos/v1/PoolService';
import type { PoolStats as _braiins_bos_v1_PoolStats, PoolStats__Output as _braiins_bos_v1_PoolStats__Output } from './braiins/bos/v1/PoolStats';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from './braiins/bos/v1/Power';
import type { PowerConstraints as _braiins_bos_v1_PowerConstraints, PowerConstraints__Output as _braiins_bos_v1_PowerConstraints__Output } from './braiins/bos/v1/PowerConstraints';
import type { PowerEfficiency as _braiins_bos_v1_PowerEfficiency, PowerEfficiency__Output as _braiins_bos_v1_PowerEfficiency__Output } from './braiins/bos/v1/PowerEfficiency';
import type { PsuInfo as _braiins_bos_v1_PsuInfo, PsuInfo__Output as _braiins_bos_v1_PsuInfo__Output } from './braiins/bos/v1/PsuInfo';
import type { Quota as _braiins_bos_v1_Quota, Quota__Output as _braiins_bos_v1_Quota__Output } from './braiins/bos/v1/Quota';
import type { RealHashrate as _braiins_bos_v1_RealHashrate, RealHashrate__Output as _braiins_bos_v1_RealHashrate__Output } from './braiins/bos/v1/RealHashrate';
import type { RemovePoolGroupRequest as _braiins_bos_v1_RemovePoolGroupRequest, RemovePoolGroupRequest__Output as _braiins_bos_v1_RemovePoolGroupRequest__Output } from './braiins/bos/v1/RemovePoolGroupRequest';
import type { RemovePoolGroupResponse as _braiins_bos_v1_RemovePoolGroupResponse, RemovePoolGroupResponse__Output as _braiins_bos_v1_RemovePoolGroupResponse__Output } from './braiins/bos/v1/RemovePoolGroupResponse';
import type { SetCoolingModeRequest as _braiins_bos_v1_SetCoolingModeRequest, SetCoolingModeRequest__Output as _braiins_bos_v1_SetCoolingModeRequest__Output } from './braiins/bos/v1/SetCoolingModeRequest';
import type { SetCoolingModeResponse as _braiins_bos_v1_SetCoolingModeResponse, SetCoolingModeResponse__Output as _braiins_bos_v1_SetCoolingModeResponse__Output } from './braiins/bos/v1/SetCoolingModeResponse';
import type { SetImmersionModeRequest as _braiins_bos_v1_SetImmersionModeRequest, SetImmersionModeRequest__Output as _braiins_bos_v1_SetImmersionModeRequest__Output } from './braiins/bos/v1/SetImmersionModeRequest';
import type { SetImmersionModeResponse as _braiins_bos_v1_SetImmersionModeResponse, SetImmersionModeResponse__Output as _braiins_bos_v1_SetImmersionModeResponse__Output } from './braiins/bos/v1/SetImmersionModeResponse';
import type { SetPoolGroupsRequest as _braiins_bos_v1_SetPoolGroupsRequest, SetPoolGroupsRequest__Output as _braiins_bos_v1_SetPoolGroupsRequest__Output } from './braiins/bos/v1/SetPoolGroupsRequest';
import type { SetPoolGroupsResponse as _braiins_bos_v1_SetPoolGroupsResponse, SetPoolGroupsResponse__Output as _braiins_bos_v1_SetPoolGroupsResponse__Output } from './braiins/bos/v1/SetPoolGroupsResponse';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from './braiins/bos/v1/Temperature';
import type { TemperatureConstraints as _braiins_bos_v1_TemperatureConstraints, TemperatureConstraints__Output as _braiins_bos_v1_TemperatureConstraints__Output } from './braiins/bos/v1/TemperatureConstraints';
import type { TemperatureSensor as _braiins_bos_v1_TemperatureSensor, TemperatureSensor__Output as _braiins_bos_v1_TemperatureSensor__Output } from './braiins/bos/v1/TemperatureSensor';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from './braiins/bos/v1/TeraHashrate';
import type { UInt32Constraints as _braiins_bos_v1_UInt32Constraints, UInt32Constraints__Output as _braiins_bos_v1_UInt32Constraints__Output } from './braiins/bos/v1/UInt32Constraints';
import type { UpdatePoolGroupRequest as _braiins_bos_v1_UpdatePoolGroupRequest, UpdatePoolGroupRequest__Output as _braiins_bos_v1_UpdatePoolGroupRequest__Output } from './braiins/bos/v1/UpdatePoolGroupRequest';
import type { UpdatePoolGroupResponse as _braiins_bos_v1_UpdatePoolGroupResponse, UpdatePoolGroupResponse__Output as _braiins_bos_v1_UpdatePoolGroupResponse__Output } from './braiins/bos/v1/UpdatePoolGroupResponse';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from './braiins/bos/v1/Voltage';
import type { VoltageConstraints as _braiins_bos_v1_VoltageConstraints, VoltageConstraints__Output as _braiins_bos_v1_VoltageConstraints__Output } from './braiins/bos/v1/VoltageConstraints';
import type { WorkSolverStats as _braiins_bos_v1_WorkSolverStats, WorkSolverStats__Output as _braiins_bos_v1_WorkSolverStats__Output } from './braiins/bos/v1/WorkSolverStats';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from './google/protobuf/BoolValue';
import type { BytesValue as _google_protobuf_BytesValue, BytesValue__Output as _google_protobuf_BytesValue__Output } from './google/protobuf/BytesValue';
import type { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from './google/protobuf/DoubleValue';
import type { FloatValue as _google_protobuf_FloatValue, FloatValue__Output as _google_protobuf_FloatValue__Output } from './google/protobuf/FloatValue';
import type { Int32Value as _google_protobuf_Int32Value, Int32Value__Output as _google_protobuf_Int32Value__Output } from './google/protobuf/Int32Value';
import type { Int64Value as _google_protobuf_Int64Value, Int64Value__Output as _google_protobuf_Int64Value__Output } from './google/protobuf/Int64Value';
import type { StringValue as _google_protobuf_StringValue, StringValue__Output as _google_protobuf_StringValue__Output } from './google/protobuf/StringValue';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from './google/protobuf/UInt32Value';
import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from './google/protobuf/UInt64Value';

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
        BosMode: EnumTypeDefinition
        BosVersion: MessageTypeDefinition<_braiins_bos_v1_BosVersion, _braiins_bos_v1_BosVersion__Output>
        Component: MessageTypeDefinition<_braiins_bos_v1_Component, _braiins_bos_v1_Component__Output>
        ControlBoardSocFamily: EnumTypeDefinition
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
        DayOfWeek: EnumTypeDefinition
        DisableHashboardsRequest: MessageTypeDefinition<_braiins_bos_v1_DisableHashboardsRequest, _braiins_bos_v1_DisableHashboardsRequest__Output>
        DisableHashboardsResponse: MessageTypeDefinition<_braiins_bos_v1_DisableHashboardsResponse, _braiins_bos_v1_DisableHashboardsResponse__Output>
        DoubleConstraints: MessageTypeDefinition<_braiins_bos_v1_DoubleConstraints, _braiins_bos_v1_DoubleConstraints__Output>
        DurationConstraints: MessageTypeDefinition<_braiins_bos_v1_DurationConstraints, _braiins_bos_v1_DurationConstraints__Output>
        EnableHashboardsRequest: MessageTypeDefinition<_braiins_bos_v1_EnableHashboardsRequest, _braiins_bos_v1_EnableHashboardsRequest__Output>
        EnableHashboardsResponse: MessageTypeDefinition<_braiins_bos_v1_EnableHashboardsResponse, _braiins_bos_v1_EnableHashboardsResponse__Output>
        ErrorCode: MessageTypeDefinition<_braiins_bos_v1_ErrorCode, _braiins_bos_v1_ErrorCode__Output>
        FanPauseMode: EnumTypeDefinition
        FanPauseRuntime: EnumTypeDefinition
        FanState: MessageTypeDefinition<_braiins_bos_v1_FanState, _braiins_bos_v1_FanState__Output>
        FixedShareRatio: MessageTypeDefinition<_braiins_bos_v1_FixedShareRatio, _braiins_bos_v1_FixedShareRatio__Output>
        Frequency: MessageTypeDefinition<_braiins_bos_v1_Frequency, _braiins_bos_v1_Frequency__Output>
        FrequencyConstraints: MessageTypeDefinition<_braiins_bos_v1_FrequencyConstraints, _braiins_bos_v1_FrequencyConstraints__Output>
        GetCoolingStateRequest: MessageTypeDefinition<_braiins_bos_v1_GetCoolingStateRequest, _braiins_bos_v1_GetCoolingStateRequest__Output>
        GetCoolingStateResponse: MessageTypeDefinition<_braiins_bos_v1_GetCoolingStateResponse, _braiins_bos_v1_GetCoolingStateResponse__Output>
        GetErrorsRequest: MessageTypeDefinition<_braiins_bos_v1_GetErrorsRequest, _braiins_bos_v1_GetErrorsRequest__Output>
        GetErrorsResponse: MessageTypeDefinition<_braiins_bos_v1_GetErrorsResponse, _braiins_bos_v1_GetErrorsResponse__Output>
        GetHashboardsRequest: MessageTypeDefinition<_braiins_bos_v1_GetHashboardsRequest, _braiins_bos_v1_GetHashboardsRequest__Output>
        GetHashboardsResponse: MessageTypeDefinition<_braiins_bos_v1_GetHashboardsResponse, _braiins_bos_v1_GetHashboardsResponse__Output>
        GetLogRequest: MessageTypeDefinition<_braiins_bos_v1_GetLogRequest, _braiins_bos_v1_GetLogRequest__Output>
        GetLogResponse: MessageTypeDefinition<_braiins_bos_v1_GetLogResponse, _braiins_bos_v1_GetLogResponse__Output>
        GetMinerDetailsRequest: MessageTypeDefinition<_braiins_bos_v1_GetMinerDetailsRequest, _braiins_bos_v1_GetMinerDetailsRequest__Output>
        GetMinerDetailsResponse: MessageTypeDefinition<_braiins_bos_v1_GetMinerDetailsResponse, _braiins_bos_v1_GetMinerDetailsResponse__Output>
        GetMinerStatsRequest: MessageTypeDefinition<_braiins_bos_v1_GetMinerStatsRequest, _braiins_bos_v1_GetMinerStatsRequest__Output>
        GetMinerStatsResponse: MessageTypeDefinition<_braiins_bos_v1_GetMinerStatsResponse, _braiins_bos_v1_GetMinerStatsResponse__Output>
        GetMinerStatusRequest: MessageTypeDefinition<_braiins_bos_v1_GetMinerStatusRequest, _braiins_bos_v1_GetMinerStatusRequest__Output>
        GetMinerStatusResponse: MessageTypeDefinition<_braiins_bos_v1_GetMinerStatusResponse, _braiins_bos_v1_GetMinerStatusResponse__Output>
        GetPoolGroupsRequest: MessageTypeDefinition<_braiins_bos_v1_GetPoolGroupsRequest, _braiins_bos_v1_GetPoolGroupsRequest__Output>
        GetPoolGroupsResponse: MessageTypeDefinition<_braiins_bos_v1_GetPoolGroupsResponse, _braiins_bos_v1_GetPoolGroupsResponse__Output>
        GetSupportArchiveRequest: MessageTypeDefinition<_braiins_bos_v1_GetSupportArchiveRequest, _braiins_bos_v1_GetSupportArchiveRequest__Output>
        GetSupportArchiveResponse: MessageTypeDefinition<_braiins_bos_v1_GetSupportArchiveResponse, _braiins_bos_v1_GetSupportArchiveResponse__Output>
        GigaHashrate: MessageTypeDefinition<_braiins_bos_v1_GigaHashrate, _braiins_bos_v1_GigaHashrate__Output>
        Hashboard: MessageTypeDefinition<_braiins_bos_v1_Hashboard, _braiins_bos_v1_Hashboard__Output>
        HashboardEnableState: MessageTypeDefinition<_braiins_bos_v1_HashboardEnableState, _braiins_bos_v1_HashboardEnableState__Output>
        HashrateConstraints: MessageTypeDefinition<_braiins_bos_v1_HashrateConstraints, _braiins_bos_v1_HashrateConstraints__Output>
        Hours: MessageTypeDefinition<_braiins_bos_v1_Hours, _braiins_bos_v1_Hours__Output>
        LogType: EnumTypeDefinition
        ManualPauseMode: MessageTypeDefinition<_braiins_bos_v1_ManualPauseMode, _braiins_bos_v1_ManualPauseMode__Output>
        MegaHashrate: MessageTypeDefinition<_braiins_bos_v1_MegaHashrate, _braiins_bos_v1_MegaHashrate__Output>
        MinerBrand: EnumTypeDefinition
        MinerError: MessageTypeDefinition<_braiins_bos_v1_MinerError, _braiins_bos_v1_MinerError__Output>
        MinerIdentity: MessageTypeDefinition<_braiins_bos_v1_MinerIdentity, _braiins_bos_v1_MinerIdentity__Output>
        MinerModel: EnumTypeDefinition
        MinerPowerStats: MessageTypeDefinition<_braiins_bos_v1_MinerPowerStats, _braiins_bos_v1_MinerPowerStats__Output>
        MinerService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_MinerServiceClient> & { service: _braiins_bos_v1_MinerServiceDefinition }
        MinerStatus: EnumTypeDefinition
        PauseMode: MessageTypeDefinition<_braiins_bos_v1_PauseMode, _braiins_bos_v1_PauseMode__Output>
        Platform: EnumTypeDefinition
        Pool: MessageTypeDefinition<_braiins_bos_v1_Pool, _braiins_bos_v1_Pool__Output>
        PoolConfiguration: MessageTypeDefinition<_braiins_bos_v1_PoolConfiguration, _braiins_bos_v1_PoolConfiguration__Output>
        PoolGroup: MessageTypeDefinition<_braiins_bos_v1_PoolGroup, _braiins_bos_v1_PoolGroup__Output>
        PoolGroupConfiguration: MessageTypeDefinition<_braiins_bos_v1_PoolGroupConfiguration, _braiins_bos_v1_PoolGroupConfiguration__Output>
        PoolService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_PoolServiceClient> & { service: _braiins_bos_v1_PoolServiceDefinition }
        PoolStats: MessageTypeDefinition<_braiins_bos_v1_PoolStats, _braiins_bos_v1_PoolStats__Output>
        Power: MessageTypeDefinition<_braiins_bos_v1_Power, _braiins_bos_v1_Power__Output>
        PowerConstraints: MessageTypeDefinition<_braiins_bos_v1_PowerConstraints, _braiins_bos_v1_PowerConstraints__Output>
        PowerEfficiency: MessageTypeDefinition<_braiins_bos_v1_PowerEfficiency, _braiins_bos_v1_PowerEfficiency__Output>
        PsuInfo: MessageTypeDefinition<_braiins_bos_v1_PsuInfo, _braiins_bos_v1_PsuInfo__Output>
        Quota: MessageTypeDefinition<_braiins_bos_v1_Quota, _braiins_bos_v1_Quota__Output>
        RealHashrate: MessageTypeDefinition<_braiins_bos_v1_RealHashrate, _braiins_bos_v1_RealHashrate__Output>
        RemovePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_RemovePoolGroupRequest, _braiins_bos_v1_RemovePoolGroupRequest__Output>
        RemovePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_RemovePoolGroupResponse, _braiins_bos_v1_RemovePoolGroupResponse__Output>
        SaveAction: EnumTypeDefinition
        SensorLocation: EnumTypeDefinition
        SetCoolingModeRequest: MessageTypeDefinition<_braiins_bos_v1_SetCoolingModeRequest, _braiins_bos_v1_SetCoolingModeRequest__Output>
        SetCoolingModeResponse: MessageTypeDefinition<_braiins_bos_v1_SetCoolingModeResponse, _braiins_bos_v1_SetCoolingModeResponse__Output>
        SetImmersionModeRequest: MessageTypeDefinition<_braiins_bos_v1_SetImmersionModeRequest, _braiins_bos_v1_SetImmersionModeRequest__Output>
        SetImmersionModeResponse: MessageTypeDefinition<_braiins_bos_v1_SetImmersionModeResponse, _braiins_bos_v1_SetImmersionModeResponse__Output>
        SetPoolGroupsRequest: MessageTypeDefinition<_braiins_bos_v1_SetPoolGroupsRequest, _braiins_bos_v1_SetPoolGroupsRequest__Output>
        SetPoolGroupsResponse: MessageTypeDefinition<_braiins_bos_v1_SetPoolGroupsResponse, _braiins_bos_v1_SetPoolGroupsResponse__Output>
        SupportArchiveFormat: EnumTypeDefinition
        Temperature: MessageTypeDefinition<_braiins_bos_v1_Temperature, _braiins_bos_v1_Temperature__Output>
        TemperatureConstraints: MessageTypeDefinition<_braiins_bos_v1_TemperatureConstraints, _braiins_bos_v1_TemperatureConstraints__Output>
        TemperatureSensor: MessageTypeDefinition<_braiins_bos_v1_TemperatureSensor, _braiins_bos_v1_TemperatureSensor__Output>
        TeraHashrate: MessageTypeDefinition<_braiins_bos_v1_TeraHashrate, _braiins_bos_v1_TeraHashrate__Output>
        UInt32Constraints: MessageTypeDefinition<_braiins_bos_v1_UInt32Constraints, _braiins_bos_v1_UInt32Constraints__Output>
        UpdatePoolGroupRequest: MessageTypeDefinition<_braiins_bos_v1_UpdatePoolGroupRequest, _braiins_bos_v1_UpdatePoolGroupRequest__Output>
        UpdatePoolGroupResponse: MessageTypeDefinition<_braiins_bos_v1_UpdatePoolGroupResponse, _braiins_bos_v1_UpdatePoolGroupResponse__Output>
        Voltage: MessageTypeDefinition<_braiins_bos_v1_Voltage, _braiins_bos_v1_Voltage__Output>
        VoltageConstraints: MessageTypeDefinition<_braiins_bos_v1_VoltageConstraints, _braiins_bos_v1_VoltageConstraints__Output>
        WorkSolverStats: MessageTypeDefinition<_braiins_bos_v1_WorkSolverStats, _braiins_bos_v1_WorkSolverStats__Output>
      }
    }
  }
  google: {
    protobuf: {
      BoolValue: MessageTypeDefinition<_google_protobuf_BoolValue, _google_protobuf_BoolValue__Output>
      BytesValue: MessageTypeDefinition<_google_protobuf_BytesValue, _google_protobuf_BytesValue__Output>
      DoubleValue: MessageTypeDefinition<_google_protobuf_DoubleValue, _google_protobuf_DoubleValue__Output>
      FloatValue: MessageTypeDefinition<_google_protobuf_FloatValue, _google_protobuf_FloatValue__Output>
      Int32Value: MessageTypeDefinition<_google_protobuf_Int32Value, _google_protobuf_Int32Value__Output>
      Int64Value: MessageTypeDefinition<_google_protobuf_Int64Value, _google_protobuf_Int64Value__Output>
      StringValue: MessageTypeDefinition<_google_protobuf_StringValue, _google_protobuf_StringValue__Output>
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      UInt32Value: MessageTypeDefinition<_google_protobuf_UInt32Value, _google_protobuf_UInt32Value__Output>
      UInt64Value: MessageTypeDefinition<_google_protobuf_UInt64Value, _google_protobuf_UInt64Value__Output>
    }
  }
}

