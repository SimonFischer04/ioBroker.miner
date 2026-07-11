import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from './braiins/bos/v1/BasesPoints';
import type { BooleanConstraint as _braiins_bos_v1_BooleanConstraint, BooleanConstraint__Output as _braiins_bos_v1_BooleanConstraint__Output } from './braiins/bos/v1/BooleanConstraint';
import type { DoubleConstraints as _braiins_bos_v1_DoubleConstraints, DoubleConstraints__Output as _braiins_bos_v1_DoubleConstraints__Output } from './braiins/bos/v1/DoubleConstraints';
import type { DurationConstraints as _braiins_bos_v1_DurationConstraints, DurationConstraints__Output as _braiins_bos_v1_DurationConstraints__Output } from './braiins/bos/v1/DurationConstraints';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from './braiins/bos/v1/Frequency';
import type { FrequencyConstraints as _braiins_bos_v1_FrequencyConstraints, FrequencyConstraints__Output as _braiins_bos_v1_FrequencyConstraints__Output } from './braiins/bos/v1/FrequencyConstraints';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from './braiins/bos/v1/GigaHashrate';
import type { HashrateConstraints as _braiins_bos_v1_HashrateConstraints, HashrateConstraints__Output as _braiins_bos_v1_HashrateConstraints__Output } from './braiins/bos/v1/HashrateConstraints';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from './braiins/bos/v1/Hours';
import type { MegaHashrate as _braiins_bos_v1_MegaHashrate, MegaHashrate__Output as _braiins_bos_v1_MegaHashrate__Output } from './braiins/bos/v1/MegaHashrate';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from './braiins/bos/v1/Power';
import type { PowerConstraints as _braiins_bos_v1_PowerConstraints, PowerConstraints__Output as _braiins_bos_v1_PowerConstraints__Output } from './braiins/bos/v1/PowerConstraints';
import type { PowerEfficiency as _braiins_bos_v1_PowerEfficiency, PowerEfficiency__Output as _braiins_bos_v1_PowerEfficiency__Output } from './braiins/bos/v1/PowerEfficiency';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from './braiins/bos/v1/Temperature';
import type { TemperatureConstraints as _braiins_bos_v1_TemperatureConstraints, TemperatureConstraints__Output as _braiins_bos_v1_TemperatureConstraints__Output } from './braiins/bos/v1/TemperatureConstraints';
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
        BasesPoints: MessageTypeDefinition<_braiins_bos_v1_BasesPoints, _braiins_bos_v1_BasesPoints__Output>
        BooleanConstraint: MessageTypeDefinition<_braiins_bos_v1_BooleanConstraint, _braiins_bos_v1_BooleanConstraint__Output>
        DayOfWeek: EnumTypeDefinition
        DoubleConstraints: MessageTypeDefinition<_braiins_bos_v1_DoubleConstraints, _braiins_bos_v1_DoubleConstraints__Output>
        DurationConstraints: MessageTypeDefinition<_braiins_bos_v1_DurationConstraints, _braiins_bos_v1_DurationConstraints__Output>
        Frequency: MessageTypeDefinition<_braiins_bos_v1_Frequency, _braiins_bos_v1_Frequency__Output>
        FrequencyConstraints: MessageTypeDefinition<_braiins_bos_v1_FrequencyConstraints, _braiins_bos_v1_FrequencyConstraints__Output>
        GigaHashrate: MessageTypeDefinition<_braiins_bos_v1_GigaHashrate, _braiins_bos_v1_GigaHashrate__Output>
        HashrateConstraints: MessageTypeDefinition<_braiins_bos_v1_HashrateConstraints, _braiins_bos_v1_HashrateConstraints__Output>
        Hours: MessageTypeDefinition<_braiins_bos_v1_Hours, _braiins_bos_v1_Hours__Output>
        MegaHashrate: MessageTypeDefinition<_braiins_bos_v1_MegaHashrate, _braiins_bos_v1_MegaHashrate__Output>
        Power: MessageTypeDefinition<_braiins_bos_v1_Power, _braiins_bos_v1_Power__Output>
        PowerConstraints: MessageTypeDefinition<_braiins_bos_v1_PowerConstraints, _braiins_bos_v1_PowerConstraints__Output>
        PowerEfficiency: MessageTypeDefinition<_braiins_bos_v1_PowerEfficiency, _braiins_bos_v1_PowerEfficiency__Output>
        Temperature: MessageTypeDefinition<_braiins_bos_v1_Temperature, _braiins_bos_v1_Temperature__Output>
        TemperatureConstraints: MessageTypeDefinition<_braiins_bos_v1_TemperatureConstraints, _braiins_bos_v1_TemperatureConstraints__Output>
        TeraHashrate: MessageTypeDefinition<_braiins_bos_v1_TeraHashrate, _braiins_bos_v1_TeraHashrate__Output>
        UInt32Constraints: MessageTypeDefinition<_braiins_bos_v1_UInt32Constraints, _braiins_bos_v1_UInt32Constraints__Output>
        Voltage: MessageTypeDefinition<_braiins_bos_v1_Voltage, _braiins_bos_v1_Voltage__Output>
        VoltageConstraints: MessageTypeDefinition<_braiins_bos_v1_VoltageConstraints, _braiins_bos_v1_VoltageConstraints__Output>
      }
    }
  }
}

