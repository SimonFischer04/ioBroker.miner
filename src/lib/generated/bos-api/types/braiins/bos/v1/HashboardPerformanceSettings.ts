// Original file: bos/v1/performance.proto

import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from '../../../braiins/bos/v1/Frequency';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';

export interface HashboardPerformanceSettings {
  'id'?: (string);
  'frequency'?: (_braiins_bos_v1_Frequency | null);
  'voltage'?: (_braiins_bos_v1_Voltage | null);
}

export interface HashboardPerformanceSettings__Output {
  'id'?: (string);
  'frequency'?: (_braiins_bos_v1_Frequency__Output);
  'voltage'?: (_braiins_bos_v1_Voltage__Output);
}
