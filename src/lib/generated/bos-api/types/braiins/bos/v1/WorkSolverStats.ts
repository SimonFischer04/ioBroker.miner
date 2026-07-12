// Original file: bos/v1/work.proto

import type { RealHashrate as _braiins_bos_v1_RealHashrate, RealHashrate__Output as _braiins_bos_v1_RealHashrate__Output } from '../../../braiins/bos/v1/RealHashrate';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from '../../../braiins/bos/v1/GigaHashrate';
import type { MegaHashrate as _braiins_bos_v1_MegaHashrate, MegaHashrate__Output as _braiins_bos_v1_MegaHashrate__Output } from '../../../braiins/bos/v1/MegaHashrate';
import type { Long } from '@grpc/proto-loader';

export interface WorkSolverStats {
  'realHashrate'?: (_braiins_bos_v1_RealHashrate | null);
  'nominalHashrate'?: (_braiins_bos_v1_GigaHashrate | null);
  'errorHashrate'?: (_braiins_bos_v1_MegaHashrate | null);
  'foundBlocks'?: (number);
  'bestShare'?: (number | string | Long);
  'bestShareStr'?: (string);
}

export interface WorkSolverStats__Output {
  'realHashrate'?: (_braiins_bos_v1_RealHashrate__Output);
  'nominalHashrate'?: (_braiins_bos_v1_GigaHashrate__Output);
  'errorHashrate'?: (_braiins_bos_v1_MegaHashrate__Output);
  'foundBlocks'?: (number);
  'bestShare'?: (number);
  'bestShareStr'?: (string);
}
