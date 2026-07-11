// Original file: bos/v1/constraints.proto

import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';

export interface PowerConstraints {
  'default'?: (_braiins_bos_v1_Power | null);
  'min'?: (_braiins_bos_v1_Power | null);
  'max'?: (_braiins_bos_v1_Power | null);
}

export interface PowerConstraints__Output {
  'default'?: (_braiins_bos_v1_Power__Output);
  'min'?: (_braiins_bos_v1_Power__Output);
  'max'?: (_braiins_bos_v1_Power__Output);
}
