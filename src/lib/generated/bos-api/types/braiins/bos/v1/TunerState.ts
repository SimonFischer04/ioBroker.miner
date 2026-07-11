// Original file: bos/v1/performance.proto

export const TunerState = {
  TUNER_STATE_UNSPECIFIED: 0,
  TUNER_STATE_DISABLED: 1,
  TUNER_STATE_STABLE: 2,
  TUNER_STATE_TUNING: 3,
  TUNER_STATE_ERROR: 4,
  TUNER_STATE_CONTINUOUS: 5,
  TUNER_STATE_PREHEAT: 6,
} as const;

export type TunerState =
  | 'TUNER_STATE_UNSPECIFIED'
  | 0
  | 'TUNER_STATE_DISABLED'
  | 1
  | 'TUNER_STATE_STABLE'
  | 2
  | 'TUNER_STATE_TUNING'
  | 3
  | 'TUNER_STATE_ERROR'
  | 4
  | 'TUNER_STATE_CONTINUOUS'
  | 5
  | 'TUNER_STATE_PREHEAT'
  | 6

export type TunerState__Output = typeof TunerState[keyof typeof TunerState]
