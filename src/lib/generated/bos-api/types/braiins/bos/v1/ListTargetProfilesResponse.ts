// Original file: bos/v1/performance.proto

import type { PowerTargetProfile as _braiins_bos_v1_PowerTargetProfile, PowerTargetProfile__Output as _braiins_bos_v1_PowerTargetProfile__Output } from '../../../braiins/bos/v1/PowerTargetProfile';
import type { HashrateTargetProfile as _braiins_bos_v1_HashrateTargetProfile, HashrateTargetProfile__Output as _braiins_bos_v1_HashrateTargetProfile__Output } from '../../../braiins/bos/v1/HashrateTargetProfile';

export interface ListTargetProfilesResponse {
  'powerTargetProfiles'?: (_braiins_bos_v1_PowerTargetProfile)[];
  'hashrateTargetProfiles'?: (_braiins_bos_v1_HashrateTargetProfile)[];
}

export interface ListTargetProfilesResponse__Output {
  'powerTargetProfiles'?: (_braiins_bos_v1_PowerTargetProfile__Output)[];
  'hashrateTargetProfiles'?: (_braiins_bos_v1_HashrateTargetProfile__Output)[];
}
