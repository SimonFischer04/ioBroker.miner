// Original file: bos/v1/license.proto

import type { LicenseType as _braiins_bos_v1_LicenseType, LicenseType__Output as _braiins_bos_v1_LicenseType__Output } from '../../../braiins/bos/v1/LicenseType';
import type { BasesPoints as _braiins_bos_v1_BasesPoints, BasesPoints__Output as _braiins_bos_v1_BasesPoints__Output } from '../../../braiins/bos/v1/BasesPoints';

export interface ExpiredLicense {
  'type'?: (_braiins_bos_v1_LicenseType);
  'contractName'?: (string);
  'devFee'?: (_braiins_bos_v1_BasesPoints | null);
}

export interface ExpiredLicense__Output {
  'type'?: (_braiins_bos_v1_LicenseType__Output);
  'contractName'?: (string);
  'devFee'?: (_braiins_bos_v1_BasesPoints__Output);
}
