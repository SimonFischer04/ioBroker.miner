// Original file: bos/v1/pool.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { PoolGroupConfiguration as _braiins_bos_v1_PoolGroupConfiguration, PoolGroupConfiguration__Output as _braiins_bos_v1_PoolGroupConfiguration__Output } from '../../../braiins/bos/v1/PoolGroupConfiguration';

export interface UpdatePoolGroupRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'group'?: (_braiins_bos_v1_PoolGroupConfiguration | null);
}

export interface UpdatePoolGroupRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'group'?: (_braiins_bos_v1_PoolGroupConfiguration__Output);
}
