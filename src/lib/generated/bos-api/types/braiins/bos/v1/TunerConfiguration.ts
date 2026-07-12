// Original file: bos/v1/performance.proto

import type { TunerMode as _braiins_bos_v1_TunerMode, TunerMode__Output as _braiins_bos_v1_TunerMode__Output } from '../../../braiins/bos/v1/TunerMode';
import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from '../../../braiins/bos/v1/TeraHashrate';

export interface TunerConfiguration {
  'enabled'?: (boolean);
  'tunerMode'?: (_braiins_bos_v1_TunerMode);
  'powerTarget'?: (_braiins_bos_v1_Power | null);
  'hashrateTarget'?: (_braiins_bos_v1_TeraHashrate | null);
  '_enabled'?: "enabled";
  '_tunerMode'?: "tunerMode";
}

export interface TunerConfiguration__Output {
  'enabled'?: (boolean);
  'tunerMode'?: (_braiins_bos_v1_TunerMode__Output);
  'powerTarget'?: (_braiins_bos_v1_Power__Output);
  'hashrateTarget'?: (_braiins_bos_v1_TeraHashrate__Output);
  '_enabled'?: "enabled";
  '_tunerMode'?: "tunerMode";
}
