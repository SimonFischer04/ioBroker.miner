// Original file: bos/v1/miner.proto

export const MinerStatus = {
  MINER_STATUS_UNSPECIFIED: 0,
  MINER_STATUS_NOT_STARTED: 1,
  MINER_STATUS_NORMAL: 2,
  MINER_STATUS_PAUSED: 3,
  MINER_STATUS_SUSPENDED: 4,
  MINER_STATUS_RESTRICTED: 5,
} as const;

export type MinerStatus =
  | 'MINER_STATUS_UNSPECIFIED'
  | 0
  | 'MINER_STATUS_NOT_STARTED'
  | 1
  | 'MINER_STATUS_NORMAL'
  | 2
  | 'MINER_STATUS_PAUSED'
  | 3
  | 'MINER_STATUS_SUSPENDED'
  | 4
  | 'MINER_STATUS_RESTRICTED'
  | 5

export type MinerStatus__Output = typeof MinerStatus[keyof typeof MinerStatus]
