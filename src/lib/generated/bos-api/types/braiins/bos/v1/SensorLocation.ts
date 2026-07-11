// Original file: bos/v1/cooling.proto

export const SensorLocation = {
  SENSOR_LOCATION_UNSPECIFIED: 0,
  SENSOR_LOCATION_CHIP: 1,
  SENSOR_LOCATION_PCB: 2,
} as const;

export type SensorLocation =
  | 'SENSOR_LOCATION_UNSPECIFIED'
  | 0
  | 'SENSOR_LOCATION_CHIP'
  | 1
  | 'SENSOR_LOCATION_PCB'
  | 2

export type SensorLocation__Output = typeof SensorLocation[keyof typeof SensorLocation]
