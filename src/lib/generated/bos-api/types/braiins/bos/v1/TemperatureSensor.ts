// Original file: bos/v1/cooling.proto

import type { SensorLocation as _braiins_bos_v1_SensorLocation, SensorLocation__Output as _braiins_bos_v1_SensorLocation__Output } from '../../../braiins/bos/v1/SensorLocation';
import type { Temperature as _braiins_bos_v1_Temperature, Temperature__Output as _braiins_bos_v1_Temperature__Output } from '../../../braiins/bos/v1/Temperature';

export interface TemperatureSensor {
  'id'?: (number);
  'location'?: (_braiins_bos_v1_SensorLocation);
  'temperature'?: (_braiins_bos_v1_Temperature | null);
  '_id'?: "id";
}

export interface TemperatureSensor__Output {
  'id'?: (number);
  'location'?: (_braiins_bos_v1_SensorLocation__Output);
  'temperature'?: (_braiins_bos_v1_Temperature__Output);
  '_id'?: "id";
}
