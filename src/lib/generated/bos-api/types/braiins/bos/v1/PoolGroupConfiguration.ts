// Original file: bos/v1/pool.proto

import type { Quota as _braiins_bos_v1_Quota, Quota__Output as _braiins_bos_v1_Quota__Output } from '../../../braiins/bos/v1/Quota';
import type { FixedShareRatio as _braiins_bos_v1_FixedShareRatio, FixedShareRatio__Output as _braiins_bos_v1_FixedShareRatio__Output } from '../../../braiins/bos/v1/FixedShareRatio';
import type { PoolConfiguration as _braiins_bos_v1_PoolConfiguration, PoolConfiguration__Output as _braiins_bos_v1_PoolConfiguration__Output } from '../../../braiins/bos/v1/PoolConfiguration';

export interface PoolGroupConfiguration {
  'uid'?: (string);
  'name'?: (string);
  'quota'?: (_braiins_bos_v1_Quota | null);
  'fixedShareRatio'?: (_braiins_bos_v1_FixedShareRatio | null);
  'pools'?: (_braiins_bos_v1_PoolConfiguration)[];
  '_uid'?: "uid";
  'loadBalanceStrategy'?: "quota"|"fixedShareRatio";
}

export interface PoolGroupConfiguration__Output {
  'uid'?: (string);
  'name'?: (string);
  'quota'?: (_braiins_bos_v1_Quota__Output);
  'fixedShareRatio'?: (_braiins_bos_v1_FixedShareRatio__Output);
  'pools'?: (_braiins_bos_v1_PoolConfiguration__Output)[];
  '_uid'?: "uid";
  'loadBalanceStrategy'?: "quota"|"fixedShareRatio";
}
