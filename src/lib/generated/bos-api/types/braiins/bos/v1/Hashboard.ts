// Original file: bos/v1/miner.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../google/protobuf/UInt32Value';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from '../../../braiins/bos/v1/Frequency';
import type { TemperatureSensor as _braiins_bos_v1_TemperatureSensor, TemperatureSensor__Output as _braiins_bos_v1_TemperatureSensor__Output } from '../../../braiins/bos/v1/TemperatureSensor';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from '../../../braiins/bos/v1/Temperature';
import type { WorkSolverStats as _braiins_bos_v1_WorkSolverStats, WorkSolverStats__Output as _braiins_bos_v1_WorkSolverStats__Output } from '../../../braiins/bos/v1/WorkSolverStats';

export interface Hashboard {
  'id'?: (string);
  'enabled'?: (boolean);
  'chipsCount'?: (_google_protobuf_UInt32Value | null);
  'currentVoltage'?: (_braiins_bos_v1_Voltage | null);
  'currentFrequency'?: (_braiins_bos_v1_Frequency | null);
  'highestChipTemp'?: (_braiins_bos_v1_TemperatureSensor | null);
  'boardTemp'?: (_braiins_bos_v1_Temperature | null);
  'stats'?: (_braiins_bos_v1_WorkSolverStats | null);
  'model'?: (string);
  'lowestInletTemp'?: (_braiins_bos_v1_Temperature | null);
  'highestOutletTemp'?: (_braiins_bos_v1_Temperature | null);
  'serialNumber'?: (string);
  'boardName'?: (string);
  'chipType'?: (string);
  'lowestWaterInletTemp'?: (_braiins_bos_v1_Temperature | null);
  'highestWaterOutletTemp'?: (_braiins_bos_v1_Temperature | null);
  '_model'?: "model";
  '_serialNumber'?: "serialNumber";
  '_boardName'?: "boardName";
  '_chipType'?: "chipType";
  '_lowestWaterInletTemp'?: "lowestWaterInletTemp";
  '_highestWaterOutletTemp'?: "highestWaterOutletTemp";
}

export interface Hashboard__Output {
  'id'?: (string);
  'enabled'?: (boolean);
  'chipsCount'?: (_google_protobuf_UInt32Value__Output);
  'currentVoltage'?: (_braiins_bos_v1_Voltage__Output);
  'currentFrequency'?: (_braiins_bos_v1_Frequency__Output);
  'highestChipTemp'?: (_braiins_bos_v1_TemperatureSensor__Output);
  'boardTemp'?: (_braiins_bos_v1_Temperature__Output);
  'stats'?: (_braiins_bos_v1_WorkSolverStats__Output);
  'model'?: (string);
  'lowestInletTemp'?: (_braiins_bos_v1_Temperature__Output);
  'highestOutletTemp'?: (_braiins_bos_v1_Temperature__Output);
  'serialNumber'?: (string);
  'boardName'?: (string);
  'chipType'?: (string);
  'lowestWaterInletTemp'?: (_braiins_bos_v1_Temperature__Output);
  'highestWaterOutletTemp'?: (_braiins_bos_v1_Temperature__Output);
  '_model'?: "model";
  '_serialNumber'?: "serialNumber";
  '_boardName'?: "boardName";
  '_chipType'?: "chipType";
  '_lowestWaterInletTemp'?: "lowestWaterInletTemp";
  '_highestWaterOutletTemp'?: "highestWaterOutletTemp";
}
