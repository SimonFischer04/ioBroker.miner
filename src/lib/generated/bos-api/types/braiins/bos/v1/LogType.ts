// Original file: bos/v1/miner.proto

export const LogType = {
  LOG_TYPE_UNSPECIFIED: 0,
  LOG_TYPE_ERRORS: 1,
  LOG_TYPE_BOSMINER: 2,
  LOG_TYPE_BOSER: 3,
  LOG_TYPE_MONITOR: 4,
  LOG_TYPE_SYSLOG: 5,
  LOG_TYPE_DMESG: 6,
} as const;

export type LogType =
  | 'LOG_TYPE_UNSPECIFIED'
  | 0
  | 'LOG_TYPE_ERRORS'
  | 1
  | 'LOG_TYPE_BOSMINER'
  | 2
  | 'LOG_TYPE_BOSER'
  | 3
  | 'LOG_TYPE_MONITOR'
  | 4
  | 'LOG_TYPE_SYSLOG'
  | 5
  | 'LOG_TYPE_DMESG'
  | 6

export type LogType__Output = typeof LogType[keyof typeof LogType]
