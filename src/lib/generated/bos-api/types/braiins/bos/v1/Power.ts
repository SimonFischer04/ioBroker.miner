// Original file: bos/v1/units.proto

import type { Long } from '@grpc/proto-loader';

export interface Power {
  'watt'?: (number | string | Long);
}

export interface Power__Output {
  'watt'?: (number);
}
