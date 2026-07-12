// Original file: bos/v1/miner.proto

import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';
import type { PowerEfficiency as _braiins_bos_v1_PowerEfficiency, PowerEfficiency__Output as _braiins_bos_v1_PowerEfficiency__Output } from '../../../braiins/bos/v1/PowerEfficiency';

export interface MinerPowerStats {
  'approximatedConsumption'?: (_braiins_bos_v1_Power | null);
  'efficiency'?: (_braiins_bos_v1_PowerEfficiency | null);
}

export interface MinerPowerStats__Output {
  'approximatedConsumption'?: (_braiins_bos_v1_Power__Output);
  'efficiency'?: (_braiins_bos_v1_PowerEfficiency__Output);
}
