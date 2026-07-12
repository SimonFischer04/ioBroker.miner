// Original file: bos/v1/performance.proto

export const DPSMode = {
  DPS_MODE_UNSPECIFIED: 0,
  DPS_MODE_NORMAL: 1,
  DPS_MODE_BOOST: 2,
} as const;

export type DPSMode =
  | 'DPS_MODE_UNSPECIFIED'
  | 0
  | 'DPS_MODE_NORMAL'
  | 1
  | 'DPS_MODE_BOOST'
  | 2

export type DPSMode__Output = typeof DPSMode[keyof typeof DPSMode]
