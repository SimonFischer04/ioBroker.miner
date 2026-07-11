// Original file: bos/v1/miner.proto

export const SupportArchiveFormat = {
  SUPPORT_ARCHIVE_FORMAT_UNSPECIFIED: 0,
  SUPPORT_ARCHIVE_FORMAT_ZIP: 1,
  SUPPORT_ARCHIVE_FORMAT_BOS: 2,
  SUPPORT_ARCHIVE_FORMAT_ZIP_ENCRYPTED: 3,
} as const;

export type SupportArchiveFormat =
  | 'SUPPORT_ARCHIVE_FORMAT_UNSPECIFIED'
  | 0
  | 'SUPPORT_ARCHIVE_FORMAT_ZIP'
  | 1
  | 'SUPPORT_ARCHIVE_FORMAT_BOS'
  | 2
  | 'SUPPORT_ARCHIVE_FORMAT_ZIP_ENCRYPTED'
  | 3

export type SupportArchiveFormat__Output = typeof SupportArchiveFormat[keyof typeof SupportArchiveFormat]
