// Original file: bos/v1/performance.proto

import type { BooleanConstraint as _braiins_bos_v1_BooleanConstraint, BooleanConstraint__Output as _braiins_bos_v1_BooleanConstraint__Output } from '../../../braiins/bos/v1/BooleanConstraint';
import type { FrequencyConstraints as _braiins_bos_v1_FrequencyConstraints, FrequencyConstraints__Output as _braiins_bos_v1_FrequencyConstraints__Output } from '../../../braiins/bos/v1/FrequencyConstraints';
import type { VoltageConstraints as _braiins_bos_v1_VoltageConstraints, VoltageConstraints__Output as _braiins_bos_v1_VoltageConstraints__Output } from '../../../braiins/bos/v1/VoltageConstraints';
import type { UInt32Constraints as _braiins_bos_v1_UInt32Constraints, UInt32Constraints__Output as _braiins_bos_v1_UInt32Constraints__Output } from '../../../braiins/bos/v1/UInt32Constraints';

export interface HashboardConstraints {
  'hashboardIds'?: (string)[];
  'enabled'?: (_braiins_bos_v1_BooleanConstraint | null);
  'frequency'?: (_braiins_bos_v1_FrequencyConstraints | null);
  'voltage'?: (_braiins_bos_v1_VoltageConstraints | null);
  'quickRampingTimeS'?: (_braiins_bos_v1_UInt32Constraints | null);
}

export interface HashboardConstraints__Output {
  'hashboardIds'?: (string)[];
  'enabled'?: (_braiins_bos_v1_BooleanConstraint__Output);
  'frequency'?: (_braiins_bos_v1_FrequencyConstraints__Output);
  'voltage'?: (_braiins_bos_v1_VoltageConstraints__Output);
  'quickRampingTimeS'?: (_braiins_bos_v1_UInt32Constraints__Output);
}
