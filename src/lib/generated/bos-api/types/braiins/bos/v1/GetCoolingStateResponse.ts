// Original file: bos/v1/cooling.proto

import type { FanState as _braiins_bos_v1_FanState, FanState__Output as _braiins_bos_v1_FanState__Output } from '../../../braiins/bos/v1/FanState';
import type { TemperatureSensor as _braiins_bos_v1_TemperatureSensor, TemperatureSensor__Output as _braiins_bos_v1_TemperatureSensor__Output } from '../../../braiins/bos/v1/TemperatureSensor';

export interface GetCoolingStateResponse {
  'fans'?: (_braiins_bos_v1_FanState)[];
  'highestTemperature'?: (_braiins_bos_v1_TemperatureSensor | null);
}

export interface GetCoolingStateResponse__Output {
  'fans'?: (_braiins_bos_v1_FanState__Output)[];
  'highestTemperature'?: (_braiins_bos_v1_TemperatureSensor__Output);
}
