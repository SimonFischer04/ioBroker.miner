// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from '../../../braiins/bos/v1/TeraHashrate';

export interface SetHashrateTargetRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'hashrateTarget'?: (_braiins_bos_v1_TeraHashrate | null);
}

export interface SetHashrateTargetRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'hashrateTarget'?: (_braiins_bos_v1_TeraHashrate__Output);
}
