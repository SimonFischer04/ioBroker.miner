// Original file: bos/v1/performance.proto

import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from '../../../braiins/bos/v1/Frequency';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';

export interface HashboardConfig {
  'id'?: (string);
  'enabled'?: (boolean);
  'frequency'?: (_braiins_bos_v1_Frequency | null);
  'voltage'?: (_braiins_bos_v1_Voltage | null);
  '_enabled'?: "enabled";
}

export interface HashboardConfig__Output {
  'id'?: (string);
  'enabled'?: (boolean);
  'frequency'?: (_braiins_bos_v1_Frequency__Output);
  'voltage'?: (_braiins_bos_v1_Voltage__Output);
  '_enabled'?: "enabled";
}
