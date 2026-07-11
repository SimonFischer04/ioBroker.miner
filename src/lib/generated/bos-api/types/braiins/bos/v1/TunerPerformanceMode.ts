// Original file: bos/v1/performance.proto

import type { PowerTargetMode as _braiins_bos_v1_PowerTargetMode, PowerTargetMode__Output as _braiins_bos_v1_PowerTargetMode__Output } from '../../../braiins/bos/v1/PowerTargetMode';
import type { HashrateTargetMode as _braiins_bos_v1_HashrateTargetMode, HashrateTargetMode__Output as _braiins_bos_v1_HashrateTargetMode__Output } from '../../../braiins/bos/v1/HashrateTargetMode';

export interface TunerPerformanceMode {
  'powerTarget'?: (_braiins_bos_v1_PowerTargetMode | null);
  'hashrateTarget'?: (_braiins_bos_v1_HashrateTargetMode | null);
  'target'?: "powerTarget"|"hashrateTarget";
}

export interface TunerPerformanceMode__Output {
  'powerTarget'?: (_braiins_bos_v1_PowerTargetMode__Output);
  'hashrateTarget'?: (_braiins_bos_v1_HashrateTargetMode__Output);
  'target'?: "powerTarget"|"hashrateTarget";
}
