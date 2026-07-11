// Original file: bos/v1/performance.proto

import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from '../../../braiins/bos/v1/TeraHashrate';
import type { Hours as _braiins_bos_v1_Hours, Hours__Output as _braiins_bos_v1_Hours__Output } from '../../../braiins/bos/v1/Hours';
import type { DPSMode as _braiins_bos_v1_DPSMode, DPSMode__Output as _braiins_bos_v1_DPSMode__Output } from '../../../braiins/bos/v1/DPSMode';

export interface DPSConfiguration {
  'enabled'?: (boolean);
  'powerStep'?: (_braiins_bos_v1_Power | null);
  'hashrateStep'?: (_braiins_bos_v1_TeraHashrate | null);
  'minPowerTarget'?: (_braiins_bos_v1_Power | null);
  'minHashrateTarget'?: (_braiins_bos_v1_TeraHashrate | null);
  'shutdownEnabled'?: (boolean);
  'shutdownDuration'?: (_braiins_bos_v1_Hours | null);
  'mode'?: (_braiins_bos_v1_DPSMode);
  'onStartTargetPercent'?: (number);
  '_enabled'?: "enabled";
  '_shutdownEnabled'?: "shutdownEnabled";
  '_mode'?: "mode";
  '_onStartTargetPercent'?: "onStartTargetPercent";
}

export interface DPSConfiguration__Output {
  'enabled'?: (boolean);
  'powerStep'?: (_braiins_bos_v1_Power__Output);
  'hashrateStep'?: (_braiins_bos_v1_TeraHashrate__Output);
  'minPowerTarget'?: (_braiins_bos_v1_Power__Output);
  'minHashrateTarget'?: (_braiins_bos_v1_TeraHashrate__Output);
  'shutdownEnabled'?: (boolean);
  'shutdownDuration'?: (_braiins_bos_v1_Hours__Output);
  'mode'?: (_braiins_bos_v1_DPSMode__Output);
  'onStartTargetPercent'?: (number);
  '_enabled'?: "enabled";
  '_shutdownEnabled'?: "shutdownEnabled";
  '_mode'?: "mode";
  '_onStartTargetPercent'?: "onStartTargetPercent";
}
