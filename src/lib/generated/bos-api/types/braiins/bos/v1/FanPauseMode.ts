// Original file: bos/v1/cooling.proto

export const FanPauseMode = {
  FAN_PAUSE_MODE_UNSPECIFIED: 0,
  FAN_PAUSE_MODE_AUTO: 1,
  FAN_PAUSE_MODE_MANUAL: 2,
} as const;

export type FanPauseMode =
  | 'FAN_PAUSE_MODE_UNSPECIFIED'
  | 0
  | 'FAN_PAUSE_MODE_AUTO'
  | 1
  | 'FAN_PAUSE_MODE_MANUAL'
  | 2

export type FanPauseMode__Output = typeof FanPauseMode[keyof typeof FanPauseMode]
