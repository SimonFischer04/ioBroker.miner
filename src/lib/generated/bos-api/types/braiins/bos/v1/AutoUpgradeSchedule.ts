// Original file: bos/v1/upgrade.proto

import type { DailySchedule as _braiins_bos_v1_DailySchedule, DailySchedule__Output as _braiins_bos_v1_DailySchedule__Output } from '../../../braiins/bos/v1/DailySchedule';
import type { WeeklySchedule as _braiins_bos_v1_WeeklySchedule, WeeklySchedule__Output as _braiins_bos_v1_WeeklySchedule__Output } from '../../../braiins/bos/v1/WeeklySchedule';
import type { MonthlySchedule as _braiins_bos_v1_MonthlySchedule, MonthlySchedule__Output as _braiins_bos_v1_MonthlySchedule__Output } from '../../../braiins/bos/v1/MonthlySchedule';

export interface AutoUpgradeSchedule {
  'daily'?: (_braiins_bos_v1_DailySchedule | null);
  'weekly'?: (_braiins_bos_v1_WeeklySchedule | null);
  'monthly'?: (_braiins_bos_v1_MonthlySchedule | null);
  'scheduleType'?: "daily"|"weekly"|"monthly";
}

export interface AutoUpgradeSchedule__Output {
  'daily'?: (_braiins_bos_v1_DailySchedule__Output);
  'weekly'?: (_braiins_bos_v1_WeeklySchedule__Output);
  'monthly'?: (_braiins_bos_v1_MonthlySchedule__Output);
  'scheduleType'?: "daily"|"weekly"|"monthly";
}
