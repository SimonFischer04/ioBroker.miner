// Original file: bos/v1/configuration.proto

import type { TunerConstraints as _braiins_bos_v1_TunerConstraints, TunerConstraints__Output as _braiins_bos_v1_TunerConstraints__Output } from '../../../braiins/bos/v1/TunerConstraints';
import type { CoolingConstraints as _braiins_bos_v1_CoolingConstraints, CoolingConstraints__Output as _braiins_bos_v1_CoolingConstraints__Output } from '../../../braiins/bos/v1/CoolingConstraints';
import type { DPSConstraints as _braiins_bos_v1_DPSConstraints, DPSConstraints__Output as _braiins_bos_v1_DPSConstraints__Output } from '../../../braiins/bos/v1/DPSConstraints';
import type { HashboardConstraints as _braiins_bos_v1_HashboardConstraints, HashboardConstraints__Output as _braiins_bos_v1_HashboardConstraints__Output } from '../../../braiins/bos/v1/HashboardConstraints';

export interface GetConstraintsResponse {
  'tunerConstraints'?: (_braiins_bos_v1_TunerConstraints | null);
  'coolingConstraints'?: (_braiins_bos_v1_CoolingConstraints | null);
  'dpsConstraints'?: (_braiins_bos_v1_DPSConstraints | null);
  'hashboardsConstraints'?: (_braiins_bos_v1_HashboardConstraints | null);
}

export interface GetConstraintsResponse__Output {
  'tunerConstraints'?: (_braiins_bos_v1_TunerConstraints__Output);
  'coolingConstraints'?: (_braiins_bos_v1_CoolingConstraints__Output);
  'dpsConstraints'?: (_braiins_bos_v1_DPSConstraints__Output);
  'hashboardsConstraints'?: (_braiins_bos_v1_HashboardConstraints__Output);
}
