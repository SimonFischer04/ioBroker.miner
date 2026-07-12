// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from '../../../braiins/bos/v1/TeraHashrate';

export interface IncrementHashrateTargetRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'hashrateTargetIncrement'?: (_braiins_bos_v1_TeraHashrate | null);
}

export interface IncrementHashrateTargetRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'hashrateTargetIncrement'?: (_braiins_bos_v1_TeraHashrate__Output);
}
