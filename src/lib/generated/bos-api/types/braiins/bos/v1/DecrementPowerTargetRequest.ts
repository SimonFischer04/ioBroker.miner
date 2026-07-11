// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';

export interface DecrementPowerTargetRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'powerTargetDecrement'?: (_braiins_bos_v1_Power | null);
}

export interface DecrementPowerTargetRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'powerTargetDecrement'?: (_braiins_bos_v1_Power__Output);
}
