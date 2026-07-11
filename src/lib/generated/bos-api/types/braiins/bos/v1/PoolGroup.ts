// Original file: bos/v1/pool.proto

import type { Quota as _braiins_bos_v1_Quota, Quota__Output as _braiins_bos_v1_Quota__Output } from '../../../braiins/bos/v1/Quota';
import type { FixedShareRatio as _braiins_bos_v1_FixedShareRatio, FixedShareRatio__Output as _braiins_bos_v1_FixedShareRatio__Output } from '../../../braiins/bos/v1/FixedShareRatio';
import type { Pool as _braiins_bos_v1_Pool, Pool__Output as _braiins_bos_v1_Pool__Output } from '../../../braiins/bos/v1/Pool';

export interface PoolGroup {
  'name'?: (string);
  'quota'?: (_braiins_bos_v1_Quota | null);
  'fixedShareRatio'?: (_braiins_bos_v1_FixedShareRatio | null);
  'pools'?: (_braiins_bos_v1_Pool)[];
  'uid'?: (string);
  'strategy'?: "quota"|"fixedShareRatio";
}

export interface PoolGroup__Output {
  'name'?: (string);
  'quota'?: (_braiins_bos_v1_Quota__Output);
  'fixedShareRatio'?: (_braiins_bos_v1_FixedShareRatio__Output);
  'pools'?: (_braiins_bos_v1_Pool__Output)[];
  'uid'?: (string);
  'strategy'?: "quota"|"fixedShareRatio";
}
