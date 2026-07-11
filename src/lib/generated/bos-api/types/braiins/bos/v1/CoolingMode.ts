// Original file: bos/v1/cooling.proto

export const CoolingMode = {
  COOLING_MODE_UNSPECIFIED: 0,
  COOLING_MODE_AUTO: 1,
  COOLING_MODE_MANUAL: 2,
  COOLING_MODE_DISABLED: 3,
  COOLING_MODE_IMMERSION: 4,
  COOLING_MODE_HYDRO: 5,
} as const;

export type CoolingMode =
  | 'COOLING_MODE_UNSPECIFIED'
  | 0
  | 'COOLING_MODE_AUTO'
  | 1
  | 'COOLING_MODE_MANUAL'
  | 2
  | 'COOLING_MODE_DISABLED'
  | 3
  | 'COOLING_MODE_IMMERSION'
  | 4
  | 'COOLING_MODE_HYDRO'
  | 5

export type CoolingMode__Output = typeof CoolingMode[keyof typeof CoolingMode]
