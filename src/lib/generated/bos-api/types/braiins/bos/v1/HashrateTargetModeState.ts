// Original file: bos/v1/performance.proto

import type { HashrateTargetProfile as _braiins_bos_v1_HashrateTargetProfile, HashrateTargetProfile__Output as _braiins_bos_v1_HashrateTargetProfile__Output } from '../../../braiins/bos/v1/HashrateTargetProfile';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from '../../../braiins/bos/v1/TeraHashrate';

export interface HashrateTargetModeState {
  'profile'?: (_braiins_bos_v1_HashrateTargetProfile | null);
  'currentTarget'?: (_braiins_bos_v1_TeraHashrate | null);
}

export interface HashrateTargetModeState__Output {
  'profile'?: (_braiins_bos_v1_HashrateTargetProfile__Output);
  'currentTarget'?: (_braiins_bos_v1_TeraHashrate__Output);
}
