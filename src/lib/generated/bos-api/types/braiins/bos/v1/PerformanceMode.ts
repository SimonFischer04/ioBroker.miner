// Original file: bos/v1/performance.proto

import type { ManualPerformanceMode as _braiins_bos_v1_ManualPerformanceMode, ManualPerformanceMode__Output as _braiins_bos_v1_ManualPerformanceMode__Output } from '../../../braiins/bos/v1/ManualPerformanceMode';
import type { TunerPerformanceMode as _braiins_bos_v1_TunerPerformanceMode, TunerPerformanceMode__Output as _braiins_bos_v1_TunerPerformanceMode__Output } from '../../../braiins/bos/v1/TunerPerformanceMode';

export interface PerformanceMode {
  'manualMode'?: (_braiins_bos_v1_ManualPerformanceMode | null);
  'tunerMode'?: (_braiins_bos_v1_TunerPerformanceMode | null);
  'mode'?: "manualMode"|"tunerMode";
}

export interface PerformanceMode__Output {
  'manualMode'?: (_braiins_bos_v1_ManualPerformanceMode__Output);
  'tunerMode'?: (_braiins_bos_v1_TunerPerformanceMode__Output);
  'mode'?: "manualMode"|"tunerMode";
}
