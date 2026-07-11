// Original file: bos/v1/miner.proto

import type { MinerIdentity as _braiins_bos_v1_MinerIdentity, MinerIdentity__Output as _braiins_bos_v1_MinerIdentity__Output } from '../../../braiins/bos/v1/MinerIdentity';
import type { Platform as _braiins_bos_v1_Platform, Platform__Output as _braiins_bos_v1_Platform__Output } from '../../../braiins/bos/v1/Platform';
import type { BosMode as _braiins_bos_v1_BosMode, BosMode__Output as _braiins_bos_v1_BosMode__Output } from '../../../braiins/bos/v1/BosMode';
import type { BosVersion as _braiins_bos_v1_BosVersion, BosVersion__Output as _braiins_bos_v1_BosVersion__Output } from '../../../braiins/bos/v1/BosVersion';
import type { GigaHashrate as _braiins_bos_v1_GigaHashrate, GigaHashrate__Output as _braiins_bos_v1_GigaHashrate__Output } from '../../../braiins/bos/v1/GigaHashrate';
import type { MinerStatus as _braiins_bos_v1_MinerStatus, MinerStatus__Output as _braiins_bos_v1_MinerStatus__Output } from '../../../braiins/bos/v1/MinerStatus';
import type { PsuInfo as _braiins_bos_v1_PsuInfo, PsuInfo__Output as _braiins_bos_v1_PsuInfo__Output } from '../../../braiins/bos/v1/PsuInfo';
import type { ControlBoardSocFamily as _braiins_bos_v1_ControlBoardSocFamily, ControlBoardSocFamily__Output as _braiins_bos_v1_ControlBoardSocFamily__Output } from '../../../braiins/bos/v1/ControlBoardSocFamily';
import type { Long } from '@grpc/proto-loader';

export interface GetMinerDetailsResponse {
  'uid'?: (string);
  'minerIdentity'?: (_braiins_bos_v1_MinerIdentity | null);
  'platform'?: (_braiins_bos_v1_Platform);
  'bosMode'?: (_braiins_bos_v1_BosMode);
  'bosVersion'?: (_braiins_bos_v1_BosVersion | null);
  'hostname'?: (string);
  'macAddress'?: (string);
  'systemUptime'?: (number | string | Long);
  'stickerHashrate'?: (_braiins_bos_v1_GigaHashrate | null);
  'bosminerUptimeS'?: (number | string | Long);
  'systemUptimeS'?: (number | string | Long);
  'status'?: (_braiins_bos_v1_MinerStatus);
  'kernelVersion'?: (string);
  'psuInfo'?: (_braiins_bos_v1_PsuInfo | null);
  'controlBoardSocFamily'?: (_braiins_bos_v1_ControlBoardSocFamily);
  'serialNumber'?: (string);
  'isPicModel'?: (boolean);
  '_psuInfo'?: "psuInfo";
  '_serialNumber'?: "serialNumber";
  '_isPicModel'?: "isPicModel";
}

export interface GetMinerDetailsResponse__Output {
  'uid'?: (string);
  'minerIdentity'?: (_braiins_bos_v1_MinerIdentity__Output);
  'platform'?: (_braiins_bos_v1_Platform__Output);
  'bosMode'?: (_braiins_bos_v1_BosMode__Output);
  'bosVersion'?: (_braiins_bos_v1_BosVersion__Output);
  'hostname'?: (string);
  'macAddress'?: (string);
  'systemUptime'?: (number);
  'stickerHashrate'?: (_braiins_bos_v1_GigaHashrate__Output);
  'bosminerUptimeS'?: (number);
  'systemUptimeS'?: (number);
  'status'?: (_braiins_bos_v1_MinerStatus__Output);
  'kernelVersion'?: (string);
  'psuInfo'?: (_braiins_bos_v1_PsuInfo__Output);
  'controlBoardSocFamily'?: (_braiins_bos_v1_ControlBoardSocFamily__Output);
  'serialNumber'?: (string);
  'isPicModel'?: (boolean);
  '_psuInfo'?: "psuInfo";
  '_serialNumber'?: "serialNumber";
  '_isPicModel'?: "isPicModel";
}
