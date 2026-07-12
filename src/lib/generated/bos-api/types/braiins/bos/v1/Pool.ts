// Original file: bos/v1/pool.proto

import type { PoolStats as _braiins_bos_v1_PoolStats, PoolStats__Output as _braiins_bos_v1_PoolStats__Output } from '../../../braiins/bos/v1/PoolStats';

export interface Pool {
  'uid'?: (string);
  'url'?: (string);
  'user'?: (string);
  'enabled'?: (boolean);
  'alive'?: (boolean);
  'active'?: (boolean);
  'stats'?: (_braiins_bos_v1_PoolStats | null);
}

export interface Pool__Output {
  'uid'?: (string);
  'url'?: (string);
  'user'?: (string);
  'enabled'?: (boolean);
  'alive'?: (boolean);
  'active'?: (boolean);
  'stats'?: (_braiins_bos_v1_PoolStats__Output);
}
