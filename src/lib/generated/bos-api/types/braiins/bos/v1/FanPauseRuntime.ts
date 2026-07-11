// Original file: bos/v1/cooling.proto

export const FanPauseRuntime = {
  FAN_PAUSE_RUNTIME_UNSPECIFIED: 0,
  FAN_PAUSE_RUNTIME_LIMITED: 1,
  FAN_PAUSE_RUNTIME_INDEFINITE: 2,
} as const;

export type FanPauseRuntime =
  | 'FAN_PAUSE_RUNTIME_UNSPECIFIED'
  | 0
  | 'FAN_PAUSE_RUNTIME_LIMITED'
  | 1
  | 'FAN_PAUSE_RUNTIME_INDEFINITE'
  | 2

export type FanPauseRuntime__Output = typeof FanPauseRuntime[keyof typeof FanPauseRuntime]
