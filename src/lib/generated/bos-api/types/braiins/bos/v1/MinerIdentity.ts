// Original file: bos/v1/miner.proto

import type { MinerBrand as _braiins_bos_v1_MinerBrand, MinerBrand__Output as _braiins_bos_v1_MinerBrand__Output } from '../../../braiins/bos/v1/MinerBrand';
import type { MinerModel as _braiins_bos_v1_MinerModel, MinerModel__Output as _braiins_bos_v1_MinerModel__Output } from '../../../braiins/bos/v1/MinerModel';

export interface MinerIdentity {
  'brand'?: (_braiins_bos_v1_MinerBrand);
  'model'?: (_braiins_bos_v1_MinerModel);
  'name'?: (string);
  'minerModel'?: (string);
}

export interface MinerIdentity__Output {
  'brand'?: (_braiins_bos_v1_MinerBrand__Output);
  'model'?: (_braiins_bos_v1_MinerModel__Output);
  'name'?: (string);
  'minerModel'?: (string);
}
