// Original file: bos/v1/upgrade.proto

import type { AutoUpgradeSchedule as _braiins_bos_v1_AutoUpgradeSchedule, AutoUpgradeSchedule__Output as _braiins_bos_v1_AutoUpgradeSchedule__Output } from '../../../braiins/bos/v1/AutoUpgradeSchedule';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface GetAutoUpgradeStatusResponse {
  'enabled'?: (boolean);
  'schedule'?: (_braiins_bos_v1_AutoUpgradeSchedule | null);
  'nextExecution'?: (_google_protobuf_Timestamp | null);
  'lastExecution'?: (_google_protobuf_Timestamp | null);
  '_schedule'?: "schedule";
  '_nextExecution'?: "nextExecution";
  '_lastExecution'?: "lastExecution";
}

export interface GetAutoUpgradeStatusResponse__Output {
  'enabled'?: (boolean);
  'schedule'?: (_braiins_bos_v1_AutoUpgradeSchedule__Output);
  'nextExecution'?: (_google_protobuf_Timestamp__Output);
  'lastExecution'?: (_google_protobuf_Timestamp__Output);
  '_schedule'?: "schedule";
  '_nextExecution'?: "nextExecution";
  '_lastExecution'?: "lastExecution";
}
