import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AutoPauseMode as _braiins_bos_v1_AutoPauseMode, AutoPauseMode__Output as _braiins_bos_v1_AutoPauseMode__Output } from './braiins/bos/v1/AutoPauseMode';
import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from './braiins/bos/v1/BasesPoints';
import type { BooleanConstraint as _braiins_bos_v1_BooleanConstraint, BooleanConstraint__Output as _braiins_bos_v1_BooleanConstraint__Output } from './braiins/bos/v1/BooleanConstraint';
import type { CoolingAutoMode as _braiins_bos_v1_CoolingAutoMode, CoolingAutoMode__Output as _braiins_bos_v1_CoolingAutoMode__Output } from './braiins/bos/v1/CoolingAutoMode';
import type { CoolingConfiguration as _braiins_bos_v1_CoolingConfiguration, CoolingConfiguration__Output as _braiins_bos_v1_CoolingConfiguration__Output } from './braiins/bos/v1/CoolingConfiguration';
import type { CoolingConstraints as _braiins_bos_v1_CoolingConstraints, CoolingConstraints__Output as _braiins_bos_v1_CoolingConstraints__Output } from './braiins/bos/v1/CoolingConstraints';
import type { CoolingDisabledMode as _braiins_bos_v1_CoolingDisabledMode, CoolingDisabledMode__Output as _braiins_bos_v1_CoolingDisabledMode__Output } from './braiins/bos/v1/CoolingDisabledMode';
import type { CoolingHydroMode as _braiins_bos_v1_CoolingHydroMode, CoolingHydroMode__Output as _braiins_bos_v1_CoolingHydroMode__Output } from './braiins/bos/v1/CoolingHydroMode';
import type { CoolingImmersionMode as _braiins_bos_v1_CoolingImmersionMode, CoolingImmersionMode__Output as _braiins_bos_v1_CoolingImmersionMode__Output } from './braiins/bos/v1/CoolingImmersionMode';
import type { CoolingManualMode as _braiins_bos_v1_CoolingManualMode, CoolingManualMode__Output as _braiins_bos_v1_CoolingManualMode__Output } from './braiins/bos/v1/CoolingManualMode';
import type { CoolingServiceClient as _braiins_bos_v1_CoolingServiceClient, CoolingServiceDefinition as _braiins_bos_v1_CoolingServiceDefinition } from './braiins/bos/v1/CoolingService';
import type { DoubleConstraints as _braiins_bos_v1_DoubleConstraints, DoubleConstraints__Output as _braiins_bos_v1_DoubleConstraints__Output } from './braiins/bos/v1/DoubleConstraints';
import type { DurationConstraints as _braiins_bos_v1_DurationConstraints, DurationConstraints__Output as _braiins_bos_v1_DurationConstraints__Output } from './braiins/bos/v1/DurationConstraints';
import type { FanState as _braiins_bos_v1_FanState, FanState__Output as _braiins_bos_v1_FanState__Output } from './braiins/bos/v1/FanState';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from './braiins/bos/v1/Frequency';
import type { FrequencyConstraints as _braiins_bos_v1_FrequencyConstraints, FrequencyConstraints__Output as _braiins_bos_v1_FrequencyConstraints__Output } from './braiins/bos/v1/FrequencyConstraints';
import type { GetCoolingStateRequest as _braiins_bos_v1_GetCoolingStateRequest, GetCoolingStateRequest__Output as _braiins_bos_v1_GetCoolingStateRequest__Output } from './braiins/bos/v1/GetCoolingStateRequest';
import type { GetCoolingStateResponse as _braiins_bos_v1_GetCoolingStateResponse, GetCoolingStateResponse__Output as _braiins_bos_v1_GetCoolingStateResponse__Output } from './braiins/bos/v1/GetCoolingStateResponse';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from './braiins/bos/v1/GigaHashrate';
import type { HashrateConstraints as _braiins_bos_v1_HashrateConstraints, HashrateConstraints__Output as _braiins_bos_v1_HashrateConstraints__Output } from './braiins/bos/v1/HashrateConstraints';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from './braiins/bos/v1/Hours';
import type { ManualPauseMode as _braiins_bos_v1_ManualPauseMode, ManualPauseMode__Output as _braiins_bos_v1_ManualPauseMode__Output } from './braiins/bos/v1/ManualPauseMode';
import type { MegaHashrate as _braiins_bos_v1_MegaHashrate, MegaHashrate__Output as _braiins_bos_v1_MegaHashrate__Output } from './braiins/bos/v1/MegaHashrate';
import type { PauseMode as _braiins_bos_v1_PauseMode, PauseMode__Output as _braiins_bos_v1_PauseMode__Output } from './braiins/bos/v1/PauseMode';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from './braiins/bos/v1/Power';
import type { PowerConstraints as _braiins_bos_v1_PowerConstraints, PowerConstraints__Output as _braiins_bos_v1_PowerConstraints__Output } from './braiins/bos/v1/PowerConstraints';
import type { PowerEfficiency as _braiins_bos_v1_PowerEfficiency, PowerEfficiency__Output as _braiins_bos_v1_PowerEfficiency__Output } from './braiins/bos/v1/PowerEfficiency';
import type { SetCoolingModeRequest as _braiins_bos_v1_SetCoolingModeRequest, SetCoolingModeRequest__Output as _braiins_bos_v1_SetCoolingModeRequest__Output } from './braiins/bos/v1/SetCoolingModeRequest';
import type { SetCoolingModeResponse as _braiins_bos_v1_SetCoolingModeResponse, SetCoolingModeResponse__Output as _braiins_bos_v1_SetCoolingModeResponse__Output } from './braiins/bos/v1/SetCoolingModeResponse';
import type { SetImmersionModeRequest as _braiins_bos_v1_SetImmersionModeRequest, SetImmersionModeRequest__Output as _braiins_bos_v1_SetImmersionModeRequest__Output } from './braiins/bos/v1/SetImmersionModeRequest';
import type { SetImmersionModeResponse as _braiins_bos_v1_SetImmersionModeResponse, SetImmersionModeResponse__Output as _braiins_bos_v1_SetImmersionModeResponse__Output } from './braiins/bos/v1/SetImmersionModeResponse';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from './braiins/bos/v1/Temperature';
import type { TemperatureConstraints as _braiins_bos_v1_TemperatureConstraints, TemperatureConstraints__Output as _braiins_bos_v1_TemperatureConstraints__Output } from './braiins/bos/v1/TemperatureConstraints';
import type { TemperatureSensor as _braiins_bos_v1_TemperatureSensor, TemperatureSensor__Output as _braiins_bos_v1_TemperatureSensor__Output } from './braiins/bos/v1/TemperatureSensor';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from './braiins/bos/v1/TeraHashrate';
import type { UInt32Constraints as _braiins_bos_v1_UInt32Constraints, UInt32Constraints__Output as _braiins_bos_v1_UInt32Constraints__Output } from './braiins/bos/v1/UInt32Constraints';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from './braiins/bos/v1/Voltage';
import type { VoltageConstraints as _braiins_bos_v1_VoltageConstraints, VoltageConstraints__Output as _braiins_bos_v1_VoltageConstraints__Output } from './braiins/bos/v1/VoltageConstraints';

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
        CoolingAutoMode: MessageTypeDefinition<_braiins_bos_v1_CoolingAutoMode, _braiins_bos_v1_CoolingAutoMode__Output>
        CoolingConfiguration: MessageTypeDefinition<_braiins_bos_v1_CoolingConfiguration, _braiins_bos_v1_CoolingConfiguration__Output>
        CoolingConstraints: MessageTypeDefinition<_braiins_bos_v1_CoolingConstraints, _braiins_bos_v1_CoolingConstraints__Output>
        CoolingDisabledMode: MessageTypeDefinition<_braiins_bos_v1_CoolingDisabledMode, _braiins_bos_v1_CoolingDisabledMode__Output>
        CoolingHydroMode: MessageTypeDefinition<_braiins_bos_v1_CoolingHydroMode, _braiins_bos_v1_CoolingHydroMode__Output>
        CoolingImmersionMode: MessageTypeDefinition<_braiins_bos_v1_CoolingImmersionMode, _braiins_bos_v1_CoolingImmersionMode__Output>
        CoolingManualMode: MessageTypeDefinition<_braiins_bos_v1_CoolingManualMode, _braiins_bos_v1_CoolingManualMode__Output>
        CoolingMode: EnumTypeDefinition
        CoolingService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_CoolingServiceClient> & { service: _braiins_bos_v1_CoolingServiceDefinition }
        DayOfWeek: EnumTypeDefinition
        DoubleConstraints: MessageTypeDefinition<_braiins_bos_v1_DoubleConstraints, _braiins_bos_v1_DoubleConstraints__Output>
        DurationConstraints: MessageTypeDefinition<_braiins_bos_v1_DurationConstraints, _braiins_bos_v1_DurationConstraints__Output>
        FanPauseMode: EnumTypeDefinition
        FanPauseRuntime: EnumTypeDefinition
        FanState: MessageTypeDefinition<_braiins_bos_v1_FanState, _braiins_bos_v1_FanState__Output>
        Frequency: MessageTypeDefinition<_braiins_bos_v1_Frequency, _braiins_bos_v1_Frequency__Output>
        FrequencyConstraints: MessageTypeDefinition<_braiins_bos_v1_FrequencyConstraints, _braiins_bos_v1_FrequencyConstraints__Output>
        GetCoolingStateRequest: MessageTypeDefinition<_braiins_bos_v1_GetCoolingStateRequest, _braiins_bos_v1_GetCoolingStateRequest__Output>
        GetCoolingStateResponse: MessageTypeDefinition<_braiins_bos_v1_GetCoolingStateResponse, _braiins_bos_v1_GetCoolingStateResponse__Output>
        GigaHashrate: MessageTypeDefinition<_braiins_bos_v1_GigaHashrate, _braiins_bos_v1_GigaHashrate__Output>
        HashrateConstraints: MessageTypeDefinition<_braiins_bos_v1_HashrateConstraints, _braiins_bos_v1_HashrateConstraints__Output>
        Hours: MessageTypeDefinition<_braiins_bos_v1_Hours, _braiins_bos_v1_Hours__Output>
        ManualPauseMode: MessageTypeDefinition<_braiins_bos_v1_ManualPauseMode, _braiins_bos_v1_ManualPauseMode__Output>
        MegaHashrate: MessageTypeDefinition<_braiins_bos_v1_MegaHashrate, _braiins_bos_v1_MegaHashrate__Output>
        PauseMode: MessageTypeDefinition<_braiins_bos_v1_PauseMode, _braiins_bos_v1_PauseMode__Output>
        Power: MessageTypeDefinition<_braiins_bos_v1_Power, _braiins_bos_v1_Power__Output>
        PowerConstraints: MessageTypeDefinition<_braiins_bos_v1_PowerConstraints, _braiins_bos_v1_PowerConstraints__Output>
        PowerEfficiency: MessageTypeDefinition<_braiins_bos_v1_PowerEfficiency, _braiins_bos_v1_PowerEfficiency__Output>
        SaveAction: EnumTypeDefinition
        SensorLocation: EnumTypeDefinition
        SetCoolingModeRequest: MessageTypeDefinition<_braiins_bos_v1_SetCoolingModeRequest, _braiins_bos_v1_SetCoolingModeRequest__Output>
        SetCoolingModeResponse: MessageTypeDefinition<_braiins_bos_v1_SetCoolingModeResponse, _braiins_bos_v1_SetCoolingModeResponse__Output>
        SetImmersionModeRequest: MessageTypeDefinition<_braiins_bos_v1_SetImmersionModeRequest, _braiins_bos_v1_SetImmersionModeRequest__Output>
        SetImmersionModeResponse: MessageTypeDefinition<_braiins_bos_v1_SetImmersionModeResponse, _braiins_bos_v1_SetImmersionModeResponse__Output>
        Temperature: MessageTypeDefinition<_braiins_bos_v1_Temperature, _braiins_bos_v1_Temperature__Output>
        TemperatureConstraints: MessageTypeDefinition<_braiins_bos_v1_TemperatureConstraints, _braiins_bos_v1_TemperatureConstraints__Output>
        TemperatureSensor: MessageTypeDefinition<_braiins_bos_v1_TemperatureSensor, _braiins_bos_v1_TemperatureSensor__Output>
        TeraHashrate: MessageTypeDefinition<_braiins_bos_v1_TeraHashrate, _braiins_bos_v1_TeraHashrate__Output>
        UInt32Constraints: MessageTypeDefinition<_braiins_bos_v1_UInt32Constraints, _braiins_bos_v1_UInt32Constraints__Output>
        Voltage: MessageTypeDefinition<_braiins_bos_v1_Voltage, _braiins_bos_v1_Voltage__Output>
        VoltageConstraints: MessageTypeDefinition<_braiins_bos_v1_VoltageConstraints, _braiins_bos_v1_VoltageConstraints__Output>
      }
    }
  }
}

