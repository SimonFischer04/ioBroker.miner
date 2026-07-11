// Original file: bos/v1/pool.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { PoolGroupConfiguration as _braiins_bos_v1_PoolGroupConfiguration, PoolGroupConfiguration__Output as _braiins_bos_v1_PoolGroupConfiguration__Output } from '../../../braiins/bos/v1/PoolGroupConfiguration';

export interface SetPoolGroupsRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'poolGroups'?: (_braiins_bos_v1_PoolGroupConfiguration)[];
}

export interface SetPoolGroupsRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'poolGroups'?: (_braiins_bos_v1_PoolGroupConfiguration__Output)[];
}
