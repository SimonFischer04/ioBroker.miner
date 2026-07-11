// Original file: bos/v1/upgrade.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface UpdateAutoUpgradeConfigResponse {
  'enabled'?: (boolean);
  'nextExecution'?: (_google_protobuf_Timestamp | null);
  '_nextExecution'?: "nextExecution";
}

export interface UpdateAutoUpgradeConfigResponse__Output {
  'enabled'?: (boolean);
  'nextExecution'?: (_google_protobuf_Timestamp__Output);
  '_nextExecution'?: "nextExecution";
}
