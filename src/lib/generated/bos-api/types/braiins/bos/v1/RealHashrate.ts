// Original file: bos/v1/work.proto

import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from '../../../braiins/bos/v1/GigaHashrate';

export interface RealHashrate {
  'last_5s'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_15s'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_30s'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_1m'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_5m'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_15m'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_30m'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_1h'?: (_braiins_bos_v1_GigaHashrate | null);
  'last_24h'?: (_braiins_bos_v1_GigaHashrate | null);
  'sinceRestart'?: (_braiins_bos_v1_GigaHashrate | null);
}

export interface RealHashrate__Output {
  'last_5s'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_15s'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_30s'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_1m'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_5m'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_15m'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_30m'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_1h'?: (_braiins_bos_v1_GigaHashrate__Output);
  'last_24h'?: (_braiins_bos_v1_GigaHashrate__Output);
  'sinceRestart'?: (_braiins_bos_v1_GigaHashrate__Output);
}
