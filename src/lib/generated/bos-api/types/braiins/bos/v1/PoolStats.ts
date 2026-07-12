// Original file: bos/v1/pool.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface PoolStats {
  'acceptedShares'?: (number | string | Long);
  'rejectedShares'?: (number | string | Long);
  'staleShares'?: (number | string | Long);
  'lastDifficulty'?: (number | string | Long);
  'bestShare'?: (number | string | Long);
  'generatedWork'?: (number | string | Long);
  'lastShareTime'?: (_google_protobuf_Timestamp | null);
  'bestShareStr'?: (string);
  '_lastShareTime'?: "lastShareTime";
}

export interface PoolStats__Output {
  'acceptedShares'?: (number);
  'rejectedShares'?: (number);
  'staleShares'?: (number);
  'lastDifficulty'?: (number);
  'bestShare'?: (number);
  'generatedWork'?: (number);
  'lastShareTime'?: (_google_protobuf_Timestamp__Output);
  'bestShareStr'?: (string);
  '_lastShareTime'?: "lastShareTime";
}
