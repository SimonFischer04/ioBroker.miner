// Original file: bos/v1/cooling.proto

import type { FanPauseRuntime as _braiins_bos_v1_FanPauseRuntime, FanPauseRuntime__Output as _braiins_bos_v1_FanPauseRuntime__Output } from '../../../braiins/bos/v1/FanPauseRuntime';

export interface ManualPauseMode {
  'pauseCooldownFanSpeedRatio'?: (number | string);
  'fanPauseRuntime'?: (_braiins_bos_v1_FanPauseRuntime);
  '_pauseCooldownFanSpeedRatio'?: "pauseCooldownFanSpeedRatio";
  '_fanPauseRuntime'?: "fanPauseRuntime";
}

export interface ManualPauseMode__Output {
  'pauseCooldownFanSpeedRatio'?: (number);
  'fanPauseRuntime'?: (_braiins_bos_v1_FanPauseRuntime__Output);
  '_pauseCooldownFanSpeedRatio'?: "pauseCooldownFanSpeedRatio";
  '_fanPauseRuntime'?: "fanPauseRuntime";
}
