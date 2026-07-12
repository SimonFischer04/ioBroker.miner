// Original file: bos/v1/cooling.proto

import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from '../../../braiins/bos/v1/Temperature';
import type { PauseMode as _braiins_bos_v1_PauseMode, PauseMode__Output as _braiins_bos_v1_PauseMode__Output } from '../../../braiins/bos/v1/PauseMode';

export interface CoolingAutoMode {
  'targetTemperature'?: (_braiins_bos_v1_Temperature | null);
  'hotTemperature'?: (_braiins_bos_v1_Temperature | null);
  'dangerousTemperature'?: (_braiins_bos_v1_Temperature | null);
  'minFanSpeed'?: (number);
  'maxFanSpeed'?: (number);
  'minimumRequiredFans'?: (number);
  'pauseMode'?: (_braiins_bos_v1_PauseMode | null);
  '_minFanSpeed'?: "minFanSpeed";
  '_maxFanSpeed'?: "maxFanSpeed";
  '_minimumRequiredFans'?: "minimumRequiredFans";
  '_pauseMode'?: "pauseMode";
}

export interface CoolingAutoMode__Output {
  'targetTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'hotTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'dangerousTemperature'?: (_braiins_bos_v1_Temperature__Output);
  'minFanSpeed'?: (number);
  'maxFanSpeed'?: (number);
  'minimumRequiredFans'?: (number);
  'pauseMode'?: (_braiins_bos_v1_PauseMode__Output);
  '_minFanSpeed'?: "minFanSpeed";
  '_maxFanSpeed'?: "maxFanSpeed";
  '_minimumRequiredFans'?: "minimumRequiredFans";
  '_pauseMode'?: "pauseMode";
}
