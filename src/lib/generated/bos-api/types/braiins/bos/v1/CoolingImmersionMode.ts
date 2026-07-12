// Original file: bos/v1/cooling.proto

import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from '../../../braiins/bos/v1/Temperature';

export interface CoolingImmersionMode {
  'hotTemperature'?: (_braiins_bos_v1_Temperature | null);
  'dangerousTemperature'?: (_braiins_bos_v1_Temperature | null);
  'targetTemperature'?: (_braiins_bos_v1_Temperature | null);
}

export interface CoolingImmersionMode__Output {
  'hotTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'dangerousTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'targetTemperature'?: (_braiins_bos_v1_Temperature__Output);
}
