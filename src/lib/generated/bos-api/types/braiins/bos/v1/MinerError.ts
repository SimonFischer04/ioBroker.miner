// Original file: bos/v1/miner.proto

import type { ErrorCode as _braiins_bos_v1_ErrorCode, ErrorCode__Output as _braiins_bos_v1_ErrorCode__Output } from '../../../braiins/bos/v1/ErrorCode';
import type { Component as _braiins_bos_v1_Component, Component__Output as _braiins_bos_v1_Component__Output } from '../../../braiins/bos/v1/Component';

export interface MinerError {
  'timestamp'?: (string);
  'message'?: (string);
  'errorCodes'?: (_braiins_bos_v1_ErrorCode)[];
  'components'?: (_braiins_bos_v1_Component)[];
}

export interface MinerError__Output {
  'timestamp'?: (string);
  'message'?: (string);
  'errorCodes'?: (_braiins_bos_v1_ErrorCode__Output)[];
  'components'?: (_braiins_bos_v1_Component__Output)[];
}
