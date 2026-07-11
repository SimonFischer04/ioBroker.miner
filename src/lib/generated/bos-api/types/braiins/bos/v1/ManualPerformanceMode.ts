// Original file: bos/v1/performance.proto

import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from '../../../braiins/bos/v1/Frequency';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';
import type { HashboardPerformanceSettings as _braiins_bos_v1_HashboardPerformanceSettings, HashboardPerformanceSettings__Output as _braiins_bos_v1_HashboardPerformanceSettings__Output } from '../../../braiins/bos/v1/HashboardPerformanceSettings';

export interface ManualPerformanceMode {
  'globalFrequency'?: (_braiins_bos_v1_Frequency | null);
  'globalVoltage'?: (_braiins_bos_v1_Voltage | null);
  'hashboards'?: (_braiins_bos_v1_HashboardPerformanceSettings)[];
}

export interface ManualPerformanceMode__Output {
  'globalFrequency'?: (_braiins_bos_v1_Frequency__Output);
  'globalVoltage'?: (_braiins_bos_v1_Voltage__Output);
  'hashboards'?: (_braiins_bos_v1_HashboardPerformanceSettings__Output)[];
}
