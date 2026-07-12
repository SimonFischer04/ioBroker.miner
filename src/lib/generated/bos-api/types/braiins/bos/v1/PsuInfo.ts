// Original file: bos/v1/miner.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../google/protobuf/UInt32Value';
import type { Voltage as _braiins_bos_v1_Voltage, Voltage__Output as _braiins_bos_v1_Voltage__Output } from '../../../braiins/bos/v1/Voltage';

export interface PsuInfo {
  'version'?: (_google_protobuf_UInt32Value | null);
  'fwVersion'?: (_google_protobuf_UInt32Value | null);
  'serialNumber'?: (string);
  'modelName'?: (string);
  'minVoltage'?: (_braiins_bos_v1_Voltage | null);
  'maxVoltage'?: (_braiins_bos_v1_Voltage | null);
  '_version'?: "version";
  '_fwVersion'?: "fwVersion";
  '_serialNumber'?: "serialNumber";
  '_modelName'?: "modelName";
  '_minVoltage'?: "minVoltage";
  '_maxVoltage'?: "maxVoltage";
}

export interface PsuInfo__Output {
  'version'?: (_google_protobuf_UInt32Value__Output);
  'fwVersion'?: (_google_protobuf_UInt32Value__Output);
  'serialNumber'?: (string);
  'modelName'?: (string);
  'minVoltage'?: (_braiins_bos_v1_Voltage__Output);
  'maxVoltage'?: (_braiins_bos_v1_Voltage__Output);
  '_version'?: "version";
  '_fwVersion'?: "fwVersion";
  '_serialNumber'?: "serialNumber";
  '_modelName'?: "modelName";
  '_minVoltage'?: "minVoltage";
  '_maxVoltage'?: "maxVoltage";
}
