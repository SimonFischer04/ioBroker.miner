// Original file: bos/v1/miner.proto

import type { PoolStats as _braiins_bos_v1_PoolStats, PoolStats__Output as _braiins_bos_v1_PoolStats__Output } from '../../../braiins/bos/v1/PoolStats';
import type { WorkSolverStats as _braiins_bos_v1_WorkSolverStats, WorkSolverStats__Output as _braiins_bos_v1_WorkSolverStats__Output } from '../../../braiins/bos/v1/WorkSolverStats';
import type { MinerPowerStats as _braiins_bos_v1_MinerPowerStats, MinerPowerStats__Output as _braiins_bos_v1_MinerPowerStats__Output } from '../../../braiins/bos/v1/MinerPowerStats';

export interface GetMinerStatsResponse {
  'poolStats'?: (_braiins_bos_v1_PoolStats | null);
  'minerStats'?: (_braiins_bos_v1_WorkSolverStats | null);
  'powerStats'?: (_braiins_bos_v1_MinerPowerStats | null);
}

export interface GetMinerStatsResponse__Output {
  'poolStats'?: (_braiins_bos_v1_PoolStats__Output);
  'minerStats'?: (_braiins_bos_v1_WorkSolverStats__Output);
  'powerStats'?: (_braiins_bos_v1_MinerPowerStats__Output);
}
