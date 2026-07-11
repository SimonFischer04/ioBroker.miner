// Original file: bos/v1/upgrade.proto

import type { DayOfWeek as _braiins_bos_v1_DayOfWeek, DayOfWeek__Output as _braiins_bos_v1_DayOfWeek__Output } from '../../../braiins/bos/v1/DayOfWeek';
import type { UpgradeTime as _braiins_bos_v1_UpgradeTime, UpgradeTime__Output as _braiins_bos_v1_UpgradeTime__Output } from '../../../braiins/bos/v1/UpgradeTime';

export interface WeeklySchedule {
  'dayOfWeek'?: (_braiins_bos_v1_DayOfWeek);
  'time'?: (_braiins_bos_v1_UpgradeTime | null);
  '_dayOfWeek'?: "dayOfWeek";
  '_time'?: "time";
}

export interface WeeklySchedule__Output {
  'dayOfWeek'?: (_braiins_bos_v1_DayOfWeek__Output);
  'time'?: (_braiins_bos_v1_UpgradeTime__Output);
  '_dayOfWeek'?: "dayOfWeek";
  '_time'?: "time";
}
