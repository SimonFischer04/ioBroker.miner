// Original file: bos/v1/cooling.proto

import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from '../../../braiins/bos/v1/Temperature';
import type { PauseMode as _braiins_bos_v1_PauseMode, PauseMode__Output as _braiins_bos_v1_PauseMode__Output } from '../../../braiins/bos/v1/PauseMode';

export interface CoolingManualMode {
  'fanSpeedRatio'?: (number | string);
  'hotTemperature'?: (_braiins_bos_v1_Temperature | null);
  'dangerousTemperature'?: (_braiins_bos_v1_Temperature | null);
  'targetTemperature'?: (_braiins_bos_v1_Temperature | null);
  'minimumRequiredFans'?: (number);
  'pauseMode'?: (_braiins_bos_v1_PauseMode | null);
  '_fanSpeedRatio'?: "fanSpeedRatio";
  '_minimumRequiredFans'?: "minimumRequiredFans";
  '_pauseMode'?: "pauseMode";
}

export interface CoolingManualMode__Output {
  'fanSpeedRatio'?: (number);
  'hotTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'dangerousTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'targetTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'minimumRequiredFans'?: (number);
  'pauseMode'?: (_braiins_bos_v1_PauseMode__Output);
  '_fanSpeedRatio'?: "fanSpeedRatio";
  '_minimumRequiredFans'?: "minimumRequiredFans";
  '_pauseMode'?: "pauseMode";
}
