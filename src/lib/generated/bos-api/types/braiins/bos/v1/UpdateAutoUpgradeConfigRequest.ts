// Original file: bos/v1/upgrade.proto

import type { AutoUpgradeSchedule as _braiins_bos_v1_AutoUpgradeSchedule, AutoUpgradeSchedule__Output as _braiins_bos_v1_AutoUpgradeSchedule__Output } from '../../../braiins/bos/v1/AutoUpgradeSchedule';

export interface UpdateAutoUpgradeConfigRequest {
  'enabled'?: (boolean);
  'schedule'?: (_braiins_bos_v1_AutoUpgradeSchedule | null);
  '_schedule'?: "schedule";
}

export interface UpdateAutoUpgradeConfigRequest__Output {
  'enabled'?: (boolean);
  'schedule'?: (_braiins_bos_v1_AutoUpgradeSchedule__Output);
  '_schedule'?: "schedule";
}
