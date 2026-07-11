// Original file: bos/v1/constraints.proto

import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';

export interface VoltageConstraints {
  'default'?: (_braiins_bos_v1_Voltage | null);
  'min'?: (_braiins_bos_v1_Voltage | null);
  'max'?: (_braiins_bos_v1_Voltage | null);
}

export interface VoltageConstraints__Output {
  'default'?: (_braiins_bos_v1_Voltage__Output);
  'min'?: (_braiins_bos_v1_Voltage__Output);
  'max'?: (_braiins_bos_v1_Voltage__Output);
}
