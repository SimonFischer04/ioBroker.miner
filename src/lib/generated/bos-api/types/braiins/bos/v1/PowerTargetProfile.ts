// Original file: bos/v1/performance.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from '../../../braiins/bos/v1/GigaHashrate';

export interface PowerTargetProfile {
  'created'?: (_google_protobuf_Timestamp | null);
  'target'?: (_braiins_bos_v1_Power | null);
  'measuredHashrate'?: (_braiins_bos_v1_GigaHashrate | null);
  'estimatedPowerConsumption'?: (_braiins_bos_v1_Power | null);
}

export interface PowerTargetProfile__Output {
  'created'?: (_google_protobuf_Timestamp__Output);
  'target'?: (_braiins_bos_v1_Power__Output);
  'measuredHashrate'?: (_braiins_bos_v1_GigaHashrate__Output);
  'estimatedPowerConsumption'?: (_braiins_bos_v1_Power__Output);
}
