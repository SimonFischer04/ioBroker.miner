// Original file: bos/v1/performance.proto

export const TunerMode = {
  TUNER_MODE_UNSPECIFIED: 0,
  TUNER_MODE_POWER_TARGET: 1,
  TUNER_MODE_HASHRATE_TARGET: 2,
} as const;

export type TunerMode =
  | 'TUNER_MODE_UNSPECIFIED'
  | 0
  | 'TUNER_MODE_POWER_TARGET'
  | 1
  | 'TUNER_MODE_HASHRATE_TARGET'
  | 2

export type TunerMode__Output = typeof TunerMode[keyof typeof TunerMode]
