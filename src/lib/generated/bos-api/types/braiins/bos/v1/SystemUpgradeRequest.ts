// Original file: bos/v1/upgrade.proto

import type { SystemUpgradeMetadata as _braiins_bos_v1_SystemUpgradeMetadata, SystemUpgradeMetadata__Output as _braiins_bos_v1_SystemUpgradeMetadata__Output } from '../../../braiins/bos/v1/SystemUpgradeMetadata';

export interface SystemUpgradeRequest {
  'metadata'?: (_braiins_bos_v1_SystemUpgradeMetadata | null);
  'data'?: (Buffer | Uint8Array | string);
  'payload'?: "metadata"|"data";
}

export interface SystemUpgradeRequest__Output {
  'metadata'?: (_braiins_bos_v1_SystemUpgradeMetadata__Output);
  'data'?: (Buffer);
  'payload'?: "metadata"|"data";
}
