// Original file: bos/v1/common.proto

export const SaveAction = {
  SAVE_ACTION_UNSPECIFIED: 0,
  SAVE_ACTION_SAVE: 1,
  SAVE_ACTION_SAVE_AND_APPLY: 2,
  SAVE_ACTION_SAVE_AND_FORCE_APPLY: 3,
} as const;

export type SaveAction =
  | 'SAVE_ACTION_UNSPECIFIED'
  | 0
  | 'SAVE_ACTION_SAVE'
  | 1
  | 'SAVE_ACTION_SAVE_AND_APPLY'
  | 2
  | 'SAVE_ACTION_SAVE_AND_FORCE_APPLY'
  | 3

export type SaveAction__Output = typeof SaveAction[keyof typeof SaveAction]
