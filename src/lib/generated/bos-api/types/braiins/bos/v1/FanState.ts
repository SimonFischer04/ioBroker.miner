// Original file: bos/v1/cooling.proto


export interface FanState {
  'position'?: (number);
  'rpm'?: (number);
  'targetSpeedRatio'?: (number | string);
  '_position'?: "position";
  '_targetSpeedRatio'?: "targetSpeedRatio";
}

export interface FanState__Output {
  'position'?: (number);
  'rpm'?: (number);
  'targetSpeedRatio'?: (number);
  '_position'?: "position";
  '_targetSpeedRatio'?: "targetSpeedRatio";
}
