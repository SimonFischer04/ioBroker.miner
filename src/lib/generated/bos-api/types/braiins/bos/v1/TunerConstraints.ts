// Original file: bos/v1/performance.proto

import type { PowerConstraints as _braiins_bos_v1_PowerConstraints, PowerConstraints__Output as _braiins_bos_v1_PowerConstraints__Output } from '../../../braiins/bos/v1/PowerConstraints';
import type { HashrateConstraints as _braiins_bos_v1_HashrateConstraints, HashrateConstraints__Output as _braiins_bos_v1_HashrateConstraints__Output } from '../../../braiins/bos/v1/HashrateConstraints';
import type { BooleanConstraint as _braiins_bos_v1_BooleanConstraint, BooleanConstraint__Output as _braiins_bos_v1_BooleanConstraint__Output } from '../../../braiins/bos/v1/BooleanConstraint';
import type { TunerMode as _braiins_bos_v1_TunerMode, TunerMode__Output as _braiins_bos_v1_TunerMode__Output } from '../../../braiins/bos/v1/TunerMode';

export interface TunerConstraints {
  'powerTarget'?: (_braiins_bos_v1_PowerConstraints | null);
  'hashrateTarget'?: (_braiins_bos_v1_HashrateConstraints | null);
  'enabled'?: (_braiins_bos_v1_BooleanConstraint | null);
  'defaultMode'?: (_braiins_bos_v1_TunerMode);
}

export interface TunerConstraints__Output {
  'powerTarget'?: (_braiins_bos_v1_PowerConstraints__Output);
  'hashrateTarget'?: (_braiins_bos_v1_HashrateConstraints__Output);
  'enabled'?: (_braiins_bos_v1_BooleanConstraint__Output);
  'defaultMode'?: (_braiins_bos_v1_TunerMode__Output);
}
