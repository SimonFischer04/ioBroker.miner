// Original file: bos/v1/license.proto

import type { LicenseType as _braiins_bos_v1_LicenseType, LicenseType__Output as _braiins_bos_v1_LicenseType__Output } from '../../../braiins/bos/v1/LicenseType';
import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from '../../../braiins/bos/v1/BasesPoints';

export interface ValidLicense {
  'type'?: (_braiins_bos_v1_LicenseType);
  'contractName'?: (string);
  'timeToRestricted'?: (number);
  'devFee'?: (_braiins_bos_v1_BasesPoints | null);
}

export interface ValidLicense__Output {
  'type'?: (_braiins_bos_v1_LicenseType__Output);
  'contractName'?: (string);
  'timeToRestricted'?: (number);
  'devFee'?: (_braiins_bos_v1_BasesPoints__Output);
}
