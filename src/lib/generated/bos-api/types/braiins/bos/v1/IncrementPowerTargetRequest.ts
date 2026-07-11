// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';

export interface IncrementPowerTargetRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'powerTargetIncrement'?: (_braiins_bos_v1_Power | null);
}

export interface IncrementPowerTargetRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'powerTargetIncrement'?: (_braiins_bos_v1_Power__Output);
}
