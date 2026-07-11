// Original file: bos/v1/cooling.proto

import type { CoolingAutoMode as _braiins_bos_v1_CoolingAutoMode, CoolingAutoMode__Output as _braiins_bos_v1_CoolingAutoMode__Output } from '../../../braiins/bos/v1/CoolingAutoMode';
import type { CoolingManualMode as _braiins_bos_v1_CoolingManualMode, CoolingManualMode__Output as _braiins_bos_v1_CoolingManualMode__Output } from '../../../braiins/bos/v1/CoolingManualMode';
import type { CoolingImmersionMode as _braiins_bos_v1_CoolingImmersionMode, CoolingImmersionMode__Output as _braiins_bos_v1_CoolingImmersionMode__Output } from '../../../braiins/bos/v1/CoolingImmersionMode';
import type { CoolingHydroMode as _braiins_bos_v1_CoolingHydroMode, CoolingHydroMode__Output as _braiins_bos_v1_CoolingHydroMode__Output } from '../../../braiins/bos/v1/CoolingHydroMode';

export interface SetCoolingModeResponse {
  'auto'?: (_braiins_bos_v1_CoolingAutoMode | null);
  'manual'?: (_braiins_bos_v1_CoolingManualMode | null);
  'immersion'?: (_braiins_bos_v1_CoolingImmersionMode | null);
  'hydro'?: (_braiins_bos_v1_CoolingHydroMode | null);
  'mode'?: "auto"|"manual"|"immersion"|"hydro";
}

export interface SetCoolingModeResponse__Output {
  'auto'?: (_braiins_bos_v1_CoolingAutoMode__Output);
  'manual'?: (_braiins_bos_v1_CoolingManualMode__Output);
  'immersion'?: (_braiins_bos_v1_CoolingImmersionMode__Output);
  'hydro'?: (_braiins_bos_v1_CoolingHydroMode__Output);
  'mode'?: "auto"|"manual"|"immersion"|"hydro";
}
