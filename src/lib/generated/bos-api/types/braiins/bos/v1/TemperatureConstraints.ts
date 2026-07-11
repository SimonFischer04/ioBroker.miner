// Original file: bos/v1/constraints.proto

import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from '../../../braiins/bos/v1/Temperature';

export interface TemperatureConstraints {
  'default'?: (_braiins_bos_v1_Temperature | null);
  'min'?: (_braiins_bos_v1_Temperature | null);
  'max'?: (_braiins_bos_v1_Temperature | null);
}

export interface TemperatureConstraints__Output {
  'default'?: (_braiins_bos_v1_Temperature__Output);
  'min'?: (_braiins_bos_v1_Temperature__Output);
  'max'?: (_braiins_bos_v1_Temperature__Output);
}
