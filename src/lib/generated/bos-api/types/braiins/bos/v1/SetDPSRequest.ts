// Original file: bos/v1/performance.proto

import type { SaveAction as _braiins_bos_v1_SaveAction, SaveAction__Output as _braiins_bos_v1_SaveAction__Output } from '../../../braiins/bos/v1/SaveAction';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from '../../../braiins/bos/v1/Hours';
import type { DPSTarget as _braiins_bos_v1_DPSTarget, DPSTarget__Output as _braiins_bos_v1_DPSTarget__Output } from '../../../braiins/bos/v1/DPSTarget';
import type { DPSMode as _braiins_bos_v1_DPSMode, DPSMode__Output as _braiins_bos_v1_DPSMode__Output } from '../../../braiins/bos/v1/DPSMode';

export interface SetDPSRequest {
  'saveAction'?: (_braiins_bos_v1_SaveAction);
  'enable'?: (boolean);
  'enableShutdown'?: (boolean);
  'shutdownDuration'?: (_braiins_bos_v1_Hours | null);
  'target'?: (_braiins_bos_v1_DPSTarget | null);
  'mode'?: (_braiins_bos_v1_DPSMode);
  'onStartTargetPercent'?: (number);
  '_enable'?: "enable";
  '_enableShutdown'?: "enableShutdown";
  '_shutdownDuration'?: "shutdownDuration";
  '_mode'?: "mode";
  '_onStartTargetPercent'?: "onStartTargetPercent";
}

export interface SetDPSRequest__Output {
  'saveAction'?: (_braiins_bos_v1_SaveAction__Output);
  'enable'?: (boolean);
  'enableShutdown'?: (boolean);
  'shutdownDuration'?: (_braiins_bos_v1_Hours__Output);
  'target'?: (_braiins_bos_v1_DPSTarget__Output);
  'mode'?: (_braiins_bos_v1_DPSMode__Output);
  'onStartTargetPercent'?: (number);
  '_enable'?: "enable";
  '_enableShutdown'?: "enableShutdown";
  '_shutdownDuration'?: "shutdownDuration";
  '_mode'?: "mode";
  '_onStartTargetPercent'?: "onStartTargetPercent";
}
