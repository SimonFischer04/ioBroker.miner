// Original file: bos/v1/performance.proto

import type { PowerTargetProfile as _braiins_bos_v1_PowerTargetProfile, PowerTargetProfile__Output as _braiins_bos_v1_PowerTargetProfile__Output } from '../../../braiins/bos/v1/PowerTargetProfile';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';

export interface PowerTargetModeState {
  'profile'?: (_braiins_bos_v1_PowerTargetProfile | null);
  'currentTarget'?: (_braiins_bos_v1_Power | null);
}

export interface PowerTargetModeState__Output {
  'profile'?: (_braiins_bos_v1_PowerTargetProfile__Output);
  'currentTarget'?: (_braiins_bos_v1_Power__Output);
}
