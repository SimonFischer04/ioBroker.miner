// Original file: bos/v1/upgrade.proto

import type { Long } from '@grpc/proto-loader';

export interface SystemUpgradeMetadata {
  'size'?: (number | string | Long);
  'hash'?: (string);
  'discardSettings'?: (boolean);
  'disableCleanup'?: (boolean);
}

export interface SystemUpgradeMetadata__Output {
  'size'?: (number);
  'hash'?: (string);
  'discardSettings'?: (boolean);
  'disableCleanup'?: (boolean);
}
