// Original file: bos/v1/cooling.proto

import type { CoolingAutoMode as _braiins_bos_v1_CoolingAutoMode, CoolingAutoMode__Output as _braiins_bos_v1_CoolingAutoMode__Output } from '../../../braiins/bos/v1/CoolingAutoMode';
import type { CoolingManualMode as _braiins_bos_v1_CoolingManualMode, CoolingManualMode__Output as _braiins_bos_v1_CoolingManualMode__Output } from '../../../braiins/bos/v1/CoolingManualMode';
import type { CoolingDisabledMode as _braiins_bos_v1_CoolingDisabledMode, CoolingDisabledMode__Output as _braiins_bos_v1_CoolingDisabledMode__Output } from '../../../braiins/bos/v1/CoolingDisabledMode';
import type { CoolingImmersionMode as _braiins_bos_v1_CoolingImmersionMode, CoolingImmersionMode__Output as _braiins_bos_v1_CoolingImmersionMode__Output } from '../../../braiins/bos/v1/CoolingImmersionMode';
import type { CoolingHydroMode as _braiins_bos_v1_CoolingHydroMode, CoolingHydroMode__Output as _braiins_bos_v1_CoolingHydroMode__Output } from '../../../braiins/bos/v1/CoolingHydroMode';

export interface CoolingConfiguration {
  'minimumRequiredFans'?: (number);
  'auto'?: (_braiins_bos_v1_CoolingAutoMode | null);
  'manual'?: (_braiins_bos_v1_CoolingManualMode | null);
  'disabled'?: (_braiins_bos_v1_CoolingDisabledMode | null);
  'immersion'?: (_braiins_bos_v1_CoolingImmersionMode | null);
  'hydro'?: (_braiins_bos_v1_CoolingHydroMode | null);
  '_minimumRequiredFans'?: "minimumRequiredFans";
  'mode'?: "auto"|"manual"|"disabled"|"immersion"|"hydro";
}

export interface CoolingConfiguration__Output {
  'minimumRequiredFans'?: (number);
  'auto'?: (_braiins_bos_v1_CoolingAutoMode__Output);
  'manual'?: (_braiins_bos_v1_CoolingManualMode__Output);
  'disabled'?: (_braiins_bos_v1_CoolingDisabledMode__Output);
  'immersion'?: (_braiins_bos_v1_CoolingImmersionMode__Output);
  'hydro'?: (_braiins_bos_v1_CoolingHydroMode__Output);
  '_minimumRequiredFans'?: "minimumRequiredFans";
  'mode'?: "auto"|"manual"|"disabled"|"immersion"|"hydro";
}
