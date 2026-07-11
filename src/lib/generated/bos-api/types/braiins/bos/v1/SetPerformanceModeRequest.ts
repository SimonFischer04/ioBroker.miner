// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { PerformanceMode as _braiins_bos_v1_PerformanceMode, PerformanceMode__Output as _braiins_bos_v1_PerformanceMode__Output } from '../../../braiins/bos/v1/PerformanceMode';

export interface SetPerformanceModeRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'mode'?: (_braiins_bos_v1_PerformanceMode | null);
}

export interface SetPerformanceModeRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'mode'?: (_braiins_bos_v1_PerformanceMode__Output);
}
