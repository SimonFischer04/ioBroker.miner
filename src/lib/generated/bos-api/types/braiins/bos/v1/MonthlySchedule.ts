// Original file: bos/v1/upgrade.proto

import type { UpgradeTime as _braiins_bos_v1_UpgradeTime, UpgradeTime__Output as _braiins_bos_v1_UpgradeTime__Output } from '../../../braiins/bos/v1/UpgradeTime';

export interface MonthlySchedule {
  'dayOfMonth'?: (number);
  'time'?: (_braiins_bos_v1_UpgradeTime | null);
  '_dayOfMonth'?: "dayOfMonth";
  '_time'?: "time";
}

export interface MonthlySchedule__Output {
  'dayOfMonth'?: (number);
  'time'?: (_braiins_bos_v1_UpgradeTime__Output);
  '_dayOfMonth'?: "dayOfMonth";
  '_time'?: "time";
}
