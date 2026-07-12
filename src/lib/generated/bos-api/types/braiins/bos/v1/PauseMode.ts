// Original file: bos/v1/cooling.proto

import type { AutoPauseMode as _braiins_bos_v1_AutoPauseMode, AutoPauseMode__Output as _braiins_bos_v1_AutoPauseMode__Output } from '../../../braiins/bos/v1/AutoPauseMode';
import type { ManualPauseMode as _braiins_bos_v1_ManualPauseMode, ManualPauseMode__Output as _braiins_bos_v1_ManualPauseMode__Output } from '../../../braiins/bos/v1/ManualPauseMode';

export interface PauseMode {
  'auto'?: (_braiins_bos_v1_AutoPauseMode | null);
  'manual'?: (_braiins_bos_v1_ManualPauseMode | null);
  'mode'?: "auto"|"manual";
}

export interface PauseMode__Output {
  'auto'?: (_braiins_bos_v1_AutoPauseMode__Output);
  'manual'?: (_braiins_bos_v1_ManualPauseMode__Output);
  'mode'?: "auto"|"manual";
}
