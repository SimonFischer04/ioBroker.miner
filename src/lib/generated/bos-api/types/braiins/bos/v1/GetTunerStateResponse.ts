// Original file: bos/v1/performance.proto

import type { TunerState as _braiins_bos_v1_TunerState, TunerState__Output as _braiins_bos_v1_TunerState__Output } from '../../../braiins/bos/v1/TunerState';
import type { PowerTargetModeState as _braiins_bos_v1_PowerTargetModeState, PowerTargetModeState__Output as _braiins_bos_v1_PowerTargetModeState__Output } from '../../../braiins/bos/v1/PowerTargetModeState';
import type { HashrateTargetModeState as _braiins_bos_v1_HashrateTargetModeState, HashrateTargetModeState__Output as _braiins_bos_v1_HashrateTargetModeState__Output } from '../../../braiins/bos/v1/HashrateTargetModeState';

export interface GetTunerStateResponse {
  'overallTunerState'?: (_braiins_bos_v1_TunerState);
  'powerTargetModeState'?: (_braiins_bos_v1_PowerTargetModeState | null);
  'hashrateTargetModeState'?: (_braiins_bos_v1_HashrateTargetModeState | null);
  'modeState'?: "powerTargetModeState"|"hashrateTargetModeState";
}

export interface GetTunerStateResponse__Output {
  'overallTunerState'?: (_braiins_bos_v1_TunerState__Output);
  'powerTargetModeState'?: (_braiins_bos_v1_PowerTargetModeState__Output);
  'hashrateTargetModeState'?: (_braiins_bos_v1_HashrateTargetModeState__Output);
  'modeState'?: "powerTargetModeState"|"hashrateTargetModeState";
}
