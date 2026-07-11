// Original file: bos/v1/cooling.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';

export interface SetImmersionModeRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'enableImmersionMode'?: (boolean);
}

export interface SetImmersionModeRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'enableImmersionMode'?: (boolean);
}
