// Original file: bos/v1/license.proto

import type { NoneLicense as _braiins_bos_v1_NoneLicense, NoneLicense__Output as _braiins_bos_v1_NoneLicense__Output } from '../../../braiins/bos/v1/NoneLicense';
import type { LimitedLicense as _braiins_bos_v1_LimitedLicense, LimitedLicense__Output as _braiins_bos_v1_LimitedLicense__Output } from '../../../braiins/bos/v1/LimitedLicense';
import type { ValidLicense as _braiins_bos_v1_ValidLicense, ValidLicense__Output as _braiins_bos_v1_ValidLicense__Output } from '../../../braiins/bos/v1/ValidLicense';
import type { ExpiredLicense as _braiins_bos_v1_ExpiredLicense, ExpiredLicense__Output as _braiins_bos_v1_ExpiredLicense__Output } from '../../../braiins/bos/v1/ExpiredLicense';

export interface GetLicenseStateResponse {
  'none'?: (_braiins_bos_v1_NoneLicense | null);
  'limited'?: (_braiins_bos_v1_LimitedLicense | null);
  'valid'?: (_braiins_bos_v1_ValidLicense | null);
  'expired'?: (_braiins_bos_v1_ExpiredLicense | null);
  'state'?: "none"|"limited"|"valid"|"expired";
}

export interface GetLicenseStateResponse__Output {
  'none'?: (_braiins_bos_v1_NoneLicense__Output);
  'limited'?: (_braiins_bos_v1_LimitedLicense__Output);
  'valid'?: (_braiins_bos_v1_ValidLicense__Output);
  'expired'?: (_braiins_bos_v1_ExpiredLicense__Output);
  'state'?: "none"|"limited"|"valid"|"expired";
}
