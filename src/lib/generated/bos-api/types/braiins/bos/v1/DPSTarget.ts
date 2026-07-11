// Original file: bos/v1/performance.proto

import type { DPSPowerTarget as _braiins_bos_v1_DPSPowerTarget, DPSPowerTarget__Output as _braiins_bos_v1_DPSPowerTarget__Output } from '../../../braiins/bos/v1/DPSPowerTarget';
import type { DPSHashrateTarget as _braiins_bos_v1_DPSHashrateTarget, DPSHashrateTarget__Output as _braiins_bos_v1_DPSHashrateTarget__Output } from '../../../braiins/bos/v1/DPSHashrateTarget';

export interface DPSTarget {
  'powerTarget'?: (_braiins_bos_v1_DPSPowerTarget | null);
  'hashrateTarget'?: (_braiins_bos_v1_DPSHashrateTarget | null);
  'target'?: "powerTarget"|"hashrateTarget";
}

export interface DPSTarget__Output {
  'powerTarget'?: (_braiins_bos_v1_DPSPowerTarget__Output);
  'hashrateTarget'?: (_braiins_bos_v1_DPSHashrateTarget__Output);
  'target'?: "powerTarget"|"hashrateTarget";
}
