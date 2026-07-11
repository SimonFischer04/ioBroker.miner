// Original file: bos/v1/performance.proto

export const RelativeTargetReference = {
  RELATIVE_TARGET_REFERENCE_UNSPECIFIED: 0,
  RELATIVE_TARGET_REFERENCE_NOMINAL: 1,
  RELATIVE_TARGET_REFERENCE_MIN: 2,
  RELATIVE_TARGET_REFERENCE_MAX: 3,
  RELATIVE_TARGET_REFERENCE_CURRENT: 4,
} as const;

export type RelativeTargetReference =
  | 'RELATIVE_TARGET_REFERENCE_UNSPECIFIED'
  | 0
  | 'RELATIVE_TARGET_REFERENCE_NOMINAL'
  | 1
  | 'RELATIVE_TARGET_REFERENCE_MIN'
  | 2
  | 'RELATIVE_TARGET_REFERENCE_MAX'
  | 3
  | 'RELATIVE_TARGET_REFERENCE_CURRENT'
  | 4

export type RelativeTargetReference__Output = typeof RelativeTargetReference[keyof typeof RelativeTargetReference]
