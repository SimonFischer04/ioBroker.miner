// Original file: bos/v1/configuration.proto

import type { PoolGroupConfiguration as _braiins_bos_v1_PoolGroupConfiguration, PoolGroupConfiguration__Output as _braiins_bos_v1_PoolGroupConfiguration__Output } from '../../../braiins/bos/v1/PoolGroupConfiguration';
import type { CoolingConfiguration as _braiins_bos_v1_CoolingConfiguration, CoolingConfiguration__Output as _braiins_bos_v1_CoolingConfiguration__Output } from '../../../braiins/bos/v1/CoolingConfiguration';
import type { TunerConfiguration as _braiins_bos_v1_TunerConfiguration, TunerConfiguration__Output as _braiins_bos_v1_TunerConfiguration__Output } from '../../../braiins/bos/v1/TunerConfiguration';
import type { DPSConfiguration as _braiins_bos_v1_DPSConfiguration, DPSConfiguration__Output as _braiins_bos_v1_DPSConfiguration__Output } from '../../../braiins/bos/v1/DPSConfiguration';
import type { HashboardPerformanceConfiguration as _braiins_bos_v1_HashboardPerformanceConfiguration, HashboardPerformanceConfiguration__Output as _braiins_bos_v1_HashboardPerformanceConfiguration__Output } from '../../../braiins/bos/v1/HashboardPerformanceConfiguration';

export interface GetMinerConfigurationResponse {
  'poolGroups'?: (_braiins_bos_v1_PoolGroupConfiguration)[];
  'temperature'?: (_braiins_bos_v1_CoolingConfiguration | null);
  'tuner'?: (_braiins_bos_v1_TunerConfiguration | null);
  'dps'?: (_braiins_bos_v1_DPSConfiguration | null);
  'hashboardConfig'?: (_braiins_bos_v1_HashboardPerformanceConfiguration | null);
}

export interface GetMinerConfigurationResponse__Output {
  'poolGroups'?: (_braiins_bos_v1_PoolGroupConfiguration__Output)[];
  'temperature'?: (_braiins_bos_v1_CoolingConfiguration__Output);
  'tuner'?: (_braiins_bos_v1_TunerConfiguration__Output);
  'dps'?: (_braiins_bos_v1_DPSConfiguration__Output);
  'hashboardConfig'?: (_braiins_bos_v1_HashboardPerformanceConfiguration__Output);
}
