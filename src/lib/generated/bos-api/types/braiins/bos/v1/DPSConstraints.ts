// Original file: bos/v1/performance.proto

import type { PowerConstraints as _braiins_bos_v1_PowerConstraints, PowerConstraints__Output as _braiins_bos_v1_PowerConstraints__Output } from '../../../braiins/bos/v1/PowerConstraints';
import type { HashrateConstraints as _braiins_bos_v1_HashrateConstraints, HashrateConstraints__Output as _braiins_bos_v1_HashrateConstraints__Output } from '../../../braiins/bos/v1/HashrateConstraints';
import type { BooleanConstraint as _braiins_bos_v1_BooleanConstraint, BooleanConstraint__Output as _braiins_bos_v1_BooleanConstraint__Output } from '../../../braiins/bos/v1/BooleanConstraint';
import type { DurationConstraints as _braiins_bos_v1_DurationConstraints, DurationConstraints__Output as _braiins_bos_v1_DurationConstraints__Output } from '../../../braiins/bos/v1/DurationConstraints';
import type { DPSMode as _braiins_bos_v1_DPSMode, DPSMode__Output as _braiins_bos_v1_DPSMode__Output } from '../../../braiins/bos/v1/DPSMode';
import type { UInt32Constraints as _braiins_bos_v1_UInt32Constraints, UInt32Constraints__Output as _braiins_bos_v1_UInt32Constraints__Output } from '../../../braiins/bos/v1/UInt32Constraints';

export interface DPSConstraints {
  'powerStep'?: (_braiins_bos_v1_PowerConstraints | null);
  'hashrateStep'?: (_braiins_bos_v1_HashrateConstraints | null);
  'minPowerTarget'?: (_braiins_bos_v1_PowerConstraints | null);
  'minHashrateTarget'?: (_braiins_bos_v1_HashrateConstraints | null);
  'shutdownEnabled'?: (_braiins_bos_v1_BooleanConstraint | null);
  'shutdownDuration'?: (_braiins_bos_v1_DurationConstraints | null);
  'enabled'?: (_braiins_bos_v1_BooleanConstraint | null);
  'mode'?: (_braiins_bos_v1_DPSMode);
  'onStartTargetPercent'?: (_braiins_bos_v1_UInt32Constraints | null);
}

export interface DPSConstraints__Output {
  'powerStep'?: (_braiins_bos_v1_PowerConstraints__Output);
  'hashrateStep'?: (_braiins_bos_v1_HashrateConstraints__Output);
  'minPowerTarget'?: (_braiins_bos_v1_PowerConstraints__Output);
  'minHashrateTarget'?: (_braiins_bos_v1_HashrateConstraints__Output);
  'shutdownEnabled'?: (_braiins_bos_v1_BooleanConstraint__Output);
  'shutdownDuration'?: (_braiins_bos_v1_DurationConstraints__Output);
  'enabled'?: (_braiins_bos_v1_BooleanConstraint__Output);
  'mode'?: (_braiins_bos_v1_DPSMode__Output);
  'onStartTargetPercent'?: (_braiins_bos_v1_UInt32Constraints__Output);
}
