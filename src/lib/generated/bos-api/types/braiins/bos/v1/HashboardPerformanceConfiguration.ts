// Original file: bos/v1/performance.proto

import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from '../../../braiins/bos/v1/Frequency';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';
import type { HashboardConfig as _braiins_bos_v1_HashboardConfig, HashboardConfig__Output as _braiins_bos_v1_HashboardConfig__Output } from '../../../braiins/bos/v1/HashboardConfig';

export interface HashboardPerformanceConfiguration {
  'globalFrequency'?: (_braiins_bos_v1_Frequency | null);
  'globalVoltage'?: (_braiins_bos_v1_Voltage | null);
  'hashboards'?: (_braiins_bos_v1_HashboardConfig)[];
  'quickRampingTimeUpS'?: (number);
  'quickRampingTimeDownS'?: (number);
  '_quickRampingTimeUpS'?: "quickRampingTimeUpS";
  '_quickRampingTimeDownS'?: "quickRampingTimeDownS";
}

export interface HashboardPerformanceConfiguration__Output {
  'globalFrequency'?: (_braiins_bos_v1_Frequency__Output);
  'globalVoltage'?: (_braiins_bos_v1_Voltage__Output);
  'hashboards'?: (_braiins_bos_v1_HashboardConfig__Output)[];
  'quickRampingTimeUpS'?: (number);
  'quickRampingTimeDownS'?: (number);
  '_quickRampingTimeUpS'?: "quickRampingTimeUpS";
  '_quickRampingTimeDownS'?: "quickRampingTimeDownS";
}
