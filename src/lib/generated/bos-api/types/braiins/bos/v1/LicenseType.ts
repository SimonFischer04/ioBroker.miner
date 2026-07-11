// Original file: bos/v1/license.proto

export const LicenseType = {
  LICENSE_TYPE_UNSPECIFIED: 0,
  LICENSE_TYPE_STANDARD: 1,
  LICENSE_TYPE_CUSTOM: 2,
} as const;

export type LicenseType =
  | 'LICENSE_TYPE_UNSPECIFIED'
  | 0
  | 'LICENSE_TYPE_STANDARD'
  | 1
  | 'LICENSE_TYPE_CUSTOM'
  | 2

export type LicenseType__Output = typeof LicenseType[keyof typeof LicenseType]
