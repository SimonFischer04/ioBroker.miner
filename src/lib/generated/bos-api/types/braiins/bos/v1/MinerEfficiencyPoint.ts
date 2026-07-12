// Original file: bos/v1/performance.proto

import type { Power as _braiins_bos_v1_Power, Power__Output as _braiins_bos_v1_Power__Output } from '../../../braiins/bos/v1/Power';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from '../../../braiins/bos/v1/Temperature';
import type { TeraHashrate as _braiins_bos_v1_TeraHashrate, TeraHashrate__Output as _braiins_bos_v1_TeraHashrate__Output } from '../../../braiins/bos/v1/TeraHashrate';
import type { Frequency as _braiins_bos_v1_Frequency, Frequency__Output as _braiins_bos_v1_Frequency__Output } from '../../../braiins/bos/v1/Frequency';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';

export interface MinerEfficiencyPoint {
  'quality'?: (number);
  'powerTarget'?: (_braiins_bos_v1_Power | null);
  'consumption'?: (_braiins_bos_v1_Power | null);
  'fanSpeed'?: (number);
  'outletTemp'?: (_braiins_bos_v1_Temperature | null);
  'ambientTemp'?: (_braiins_bos_v1_Temperature | null);
  'hashrate'?: (_braiins_bos_v1_TeraHashrate | null);
  'frequency'?: (_braiins_bos_v1_Frequency | null);
  'voltage'?: (_braiins_bos_v1_Voltage | null);
}

export interface MinerEfficiencyPoint__Output {
  'quality'?: (number);
  'powerTarget'?: (_braiins_bos_v1_Power__Output);
  'consumption'?: (_braiins_bos_v1_Power__Output);
  'fanSpeed'?: (number);
  'outletTemp'?: (_braiins_bos_v1_Temperature__Output);
  'ambientTemp'?: (_braiins_bos_v1_Temperature__Output);
  'hashrate'?: (_braiins_bos_v1_TeraHashrate__Output);
  'frequency'?: (_braiins_bos_v1_Frequency__Output);
  'voltage'?: (_braiins_bos_v1_Voltage__Output);
}
