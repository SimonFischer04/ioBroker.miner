// Original file: bos/v1/cooling.proto

import type { CoolingMode as _braiins_bos_v1_CoolingMode, CoolingMode__Output as _braiins_bos_v1_CoolingMode__Output } from '../../../braiins/bos/v1/CoolingMode';
import type { TemperatureConstraints as _braiins_bos_v1_TemperatureConstraints, TemperatureConstraints__Output as _braiins_bos_v1_TemperatureConstraints__Output } from '../../../braiins/bos/v1/TemperatureConstraints';
import type { DoubleConstraints as _braiins_bos_v1_DoubleConstraints, DoubleConstraints__Output as _braiins_bos_v1_DoubleConstraints__Output } from '../../../braiins/bos/v1/DoubleConstraints';
import type { UInt32Constraints as _braiins_bos_v1_UInt32Constraints, UInt32Constraints__Output as _braiins_bos_v1_UInt32Constraints__Output } from '../../../braiins/bos/v1/UInt32Constraints';
import type { FanPauseMode as _braiins_bos_v1_FanPauseMode, FanPauseMode__Output as _braiins_bos_v1_FanPauseMode__Output } from '../../../braiins/bos/v1/FanPauseMode';
import type { FanPauseRuntime as _braiins_bos_v1_FanPauseRuntime, FanPauseRuntime__Output as _braiins_bos_v1_FanPauseRuntime__Output } from '../../../braiins/bos/v1/FanPauseRuntime';

export interface CoolingConstraints {
  'defaultCoolingMode'?: (_braiins_bos_v1_CoolingMode);
  'targetTemperature'?: (_braiins_bos_v1_TemperatureConstraints | null);
  'hotTemperature'?: (_braiins_bos_v1_TemperatureConstraints | null);
  'dangerousTemperature'?: (_braiins_bos_v1_TemperatureConstraints | null);
  'fanSpeedRatio'?: (_braiins_bos_v1_DoubleConstraints | null);
  'minimumRequiredFans'?: (_braiins_bos_v1_UInt32Constraints | null);
  'minFanSpeed'?: (_braiins_bos_v1_UInt32Constraints | null);
  'maxFanSpeed'?: (_braiins_bos_v1_UInt32Constraints | null);
  'pauseCooldownFanSpeedRatio'?: (_braiins_bos_v1_DoubleConstraints | null);
  'defaultFanPauseMode'?: (_braiins_bos_v1_FanPauseMode);
  'defaultFanPauseRuntime'?: (_braiins_bos_v1_FanPauseRuntime);
  'fanPauseRuntimeLimitedDurationS'?: (number);
  '_defaultFanPauseMode'?: "defaultFanPauseMode";
  '_defaultFanPauseRuntime'?: "defaultFanPauseRuntime";
  '_fanPauseRuntimeLimitedDurationS'?: "fanPauseRuntimeLimitedDurationS";
}

export interface CoolingConstraints__Output {
  'defaultCoolingMode'?: (_braiins_bos_v1_CoolingMode__Output);
  'targetTemperature'?: (_braiins_bos_v1_TemperatureConstraints__Output);
  'hotTemperature'?: (_braiins_bos_v1_TemperatureConstraints__Output);
  'dangerousTemperature'?: (_braiins_bos_v1_TemperatureConstraints__Output);
  'fanSpeedRatio'?: (_braiins_bos_v1_DoubleConstraints__Output);
  'minimumRequiredFans'?: (_braiins_bos_v1_UInt32Constraints__Output);
  'minFanSpeed'?: (_braiins_bos_v1_UInt32Constraints__Output);
  'maxFanSpeed'?: (_braiins_bos_v1_UInt32Constraints__Output);
  'pauseCooldownFanSpeedRatio'?: (_braiins_bos_v1_DoubleConstraints__Output);
  'defaultFanPauseMode'?: (_braiins_bos_v1_FanPauseMode__Output);
  'defaultFanPauseRuntime'?: (_braiins_bos_v1_FanPauseRuntime__Output);
  'fanPauseRuntimeLimitedDurationS'?: (number);
  '_defaultFanPauseMode'?: "defaultFanPauseMode";
  '_defaultFanPauseRuntime'?: "defaultFanPauseRuntime";
  '_fanPauseRuntimeLimitedDurationS'?: "fanPauseRuntimeLimitedDurationS";
}
