// Original file: bos/v1/miner.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';

export interface EnableHashboardsRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'hashboardIds'?: (string)[];
}

export interface EnableHashboardsRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'hashboardIds'?: (string)[];
}
