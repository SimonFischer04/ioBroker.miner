// Original file: bos/v1/constraints.proto

import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from '../../../braiins/bos/v1/Hours';

export interface DurationConstraints {
  'default'?: (_braiins_bos_v1_Hours | null);
  'min'?: (_braiins_bos_v1_Hours | null);
  'max'?: (_braiins_bos_v1_Hours | null);
}

export interface DurationConstraints__Output {
  'default'?: (_braiins_bos_v1_Hours__Output);
  'min'?: (_braiins_bos_v1_Hours__Output);
  'max'?: (_braiins_bos_v1_Hours__Output);
}
