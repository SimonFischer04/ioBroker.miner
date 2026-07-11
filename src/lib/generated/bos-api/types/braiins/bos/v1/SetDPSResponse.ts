// Original file: bos/v1/performance.proto

import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from '../../../braiins/bos/v1/Hours';
import type { DPSPowerTarget as _braiins_bos_v1_DPSPowerTarget, DPSPowerTarget__Output as _braiins_bos_v1_DPSPowerTarget__Output } from '../../../braiins/bos/v1/DPSPowerTarget';
import type { DPSHashrateTarget as _braiins_bos_v1_DPSHashrateTarget, DPSHashrateTarget__Output as _braiins_bos_v1_DPSHashrateTarget__Output } from '../../../braiins/bos/v1/DPSHashrateTarget';
import type { DPSMode as _braiins_bos_v1_DPSMode, DPSMode__Output as _braiins_bos_v1_DPSMode__Output } from '../../../braiins/bos/v1/DPSMode';

export interface SetDPSResponse {
  'enabled'?: (boolean);
  'shutdownEnabled'?: (boolean);
  'shutdownDuration'?: (_braiins_bos_v1_Hours | null);
  'powerTarget'?: (_braiins_bos_v1_DPSPowerTarget | null);
  'hashrateTarget'?: (_braiins_bos_v1_DPSHashrateTarget | null);
  'mode'?: (_braiins_bos_v1_DPSMode);
  'onStartTargetPercent'?: (number);
  '_enabled'?: "enabled";
  '_shutdownEnabled'?: "shutdownEnabled";
  '_shutdownDuration'?: "shutdownDuration";
  '_mode'?: "mode";
  '_onStartTargetPercent'?: "onStartTargetPercent";
}

export interface SetDPSResponse__Output {
  'enabled'?: (boolean);
  'shutdownEnabled'?: (boolean);
  'shutdownDuration'?: (_braiins_bos_v1_Hours__Output);
  'powerTarget'?: (_braiins_bos_v1_DPSPowerTarget__Output);
  'hashrateTarget'?: (_braiins_bos_v1_DPSHashrateTarget__Output);
  'mode'?: (_braiins_bos_v1_DPSMode__Output);
  'onStartTargetPercent'?: (number);
  '_enabled'?: "enabled";
  '_shutdownEnabled'?: "shutdownEnabled";
  '_shutdownDuration'?: "shutdownDuration";
  '_mode'?: "mode";
  '_onStartTargetPercent'?: "onStartTargetPercent";
}
