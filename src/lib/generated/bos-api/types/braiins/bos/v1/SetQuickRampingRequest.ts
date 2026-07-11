// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';

export interface SetQuickRampingRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'upS'?: (number);
  'downS'?: (number);
}

export interface SetQuickRampingRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'upS'?: (number);
  'downS'?: (number);
}
