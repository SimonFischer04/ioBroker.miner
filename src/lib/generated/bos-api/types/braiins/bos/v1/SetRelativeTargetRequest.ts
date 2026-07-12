// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { RelativeTargetReference as _braiins_bos_v1_RelativeTargetReference, RelativeTargetReference__Output as _braiins_bos_v1_RelativeTargetReference__Output } from '../../../braiins/bos/v1/RelativeTargetReference';

export interface SetRelativeTargetRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'percentage'?: (number | string);
  'reference'?: (_braiins_bos_v1_RelativeTargetReference);
}

export interface SetRelativeTargetRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'percentage'?: (number);
  'reference'?: (_braiins_bos_v1_RelativeTargetReference__Output);
}
