// Original file: bos/v1/miner.proto

export const BosMode = {
  BOS_MODE_UNSPECIFIED: 0,
  BOS_MODE_UPGRADE: 1,
  BOS_MODE_RECOVERY: 2,
  BOS_MODE_SD: 3,
  BOS_MODE_NAND: 4,
  BOS_MODE_EMMC: 5,
} as const;

export type BosMode =
  | 'BOS_MODE_UNSPECIFIED'
  | 0
  | 'BOS_MODE_UPGRADE'
  | 1
  | 'BOS_MODE_RECOVERY'
  | 2
  | 'BOS_MODE_SD'
  | 3
  | 'BOS_MODE_NAND'
  | 4
  | 'BOS_MODE_EMMC'
  | 5

export type BosMode__Output = typeof BosMode[keyof typeof BosMode]
