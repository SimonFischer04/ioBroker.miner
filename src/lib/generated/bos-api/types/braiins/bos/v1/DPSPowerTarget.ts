// Original file: bos/v1/performance.proto

import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';

export interface DPSPowerTarget {
  'powerStep'?: (_braiins_bos_v1_Power | null);
  'minPowerTarget'?: (_braiins_bos_v1_Power | null);
}

export interface DPSPowerTarget__Output {
  'powerStep'?: (_braiins_bos_v1_Power__Output);
  'minPowerTarget'?: (_braiins_bos_v1_Power__Output);
}
