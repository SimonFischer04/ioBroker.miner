// Original file: bos/v1/advanced_settings.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetSettingsRequest as _braiins_bos_v1_GetSettingsRequest, GetSettingsRequest__Output as _braiins_bos_v1_GetSettingsRequest__Output } from '../../../braiins/bos/v1/GetSettingsRequest';
import type { GetSettingsResponse as _braiins_bos_v1_GetSettingsResponse, GetSettingsResponse__Output as _braiins_bos_v1_GetSettingsResponse__Output } from '../../../braiins/bos/v1/GetSettingsResponse';
import type { GetSettingsSchemaRequest as _braiins_bos_v1_GetSettingsSchemaRequest, GetSettingsSchemaRequest__Output as _braiins_bos_v1_GetSettingsSchemaRequest__Output } from '../../../braiins/bos/v1/GetSettingsSchemaRequest';
import type { GetSettingsSchemaResponse as _braiins_bos_v1_GetSettingsSchemaResponse, GetSettingsSchemaResponse__Output as _braiins_bos_v1_GetSettingsSchemaResponse__Output } from '../../../braiins/bos/v1/GetSettingsSchemaResponse';
import type { ResetAllSettingsRequest as _braiins_bos_v1_ResetAllSettingsRequest, ResetAllSettingsRequest__Output as _braiins_bos_v1_ResetAllSettingsRequest__Output } from '../../../braiins/bos/v1/ResetAllSettingsRequest';
import type { ResetAllSettingsResponse as _braiins_bos_v1_ResetAllSettingsResponse, ResetAllSettingsResponse__Output as _braiins_bos_v1_ResetAllSettingsResponse__Output } from '../../../braiins/bos/v1/ResetAllSettingsResponse';
import type { SetSettingsRequest as _braiins_bos_v1_SetSettingsRequest, SetSettingsRequest__Output as _braiins_bos_v1_SetSettingsRequest__Output } from '../../../braiins/bos/v1/SetSettingsRequest';
import type { SetSettingsResponse as _braiins_bos_v1_SetSettingsResponse, SetSettingsResponse__Output as _braiins_bos_v1_SetSettingsResponse__Output } from '../../../braiins/bos/v1/SetSettingsResponse';

export interface AdvancedSettingsServiceClient extends grpc.Client {
  GetSettings(argument: _braiins_bos_v1_GetSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  GetSettings(argument: _braiins_bos_v1_GetSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  GetSettings(argument: _braiins_bos_v1_GetSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  GetSettings(argument: _braiins_bos_v1_GetSettingsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  getSettings(argument: _braiins_bos_v1_GetSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  getSettings(argument: _braiins_bos_v1_GetSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  getSettings(argument: _braiins_bos_v1_GetSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  getSettings(argument: _braiins_bos_v1_GetSettingsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsResponse__Output>): grpc.ClientUnaryCall;
  
  GetSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  GetSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  GetSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  GetSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  getSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  getSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  getSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  getSettingsSchema(argument: _braiins_bos_v1_GetSettingsSchemaRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetSettingsSchemaResponse__Output>): grpc.ClientUnaryCall;
  
  ResetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  ResetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  ResetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  ResetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  resetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  resetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  resetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  resetAllSettings(argument: _braiins_bos_v1_ResetAllSettingsRequest, callback: grpc.requestCallback<_braiins_bos_v1_ResetAllSettingsResponse__Output>): grpc.ClientUnaryCall;
  
  SetSettings(argument: _braiins_bos_v1_SetSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  SetSettings(argument: _braiins_bos_v1_SetSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  SetSettings(argument: _braiins_bos_v1_SetSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  SetSettings(argument: _braiins_bos_v1_SetSettingsRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  setSettings(argument: _braiins_bos_v1_SetSettingsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  setSettings(argument: _braiins_bos_v1_SetSettingsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  setSettings(argument: _braiins_bos_v1_SetSettingsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  setSettings(argument: _braiins_bos_v1_SetSettingsRequest, callback: grpc.requestCallback<_braiins_bos_v1_SetSettingsResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AdvancedSettingsServiceHandlers extends grpc.UntypedServiceImplementation {
  GetSettings: grpc.handleUnaryCall<_braiins_bos_v1_GetSettingsRequest__Output, _braiins_bos_v1_GetSettingsResponse>;
  
  GetSettingsSchema: grpc.handleUnaryCall<_braiins_bos_v1_GetSettingsSchemaRequest__Output, _braiins_bos_v1_GetSettingsSchemaResponse>;
  
  ResetAllSettings: grpc.handleUnaryCall<_braiins_bos_v1_ResetAllSettingsRequest__Output, _braiins_bos_v1_ResetAllSettingsResponse>;
  
  SetSettings: grpc.handleUnaryCall<_braiins_bos_v1_SetSettingsRequest__Output, _braiins_bos_v1_SetSettingsResponse>;
  
}

export interface AdvancedSettingsServiceDefinition extends grpc.ServiceDefinition {
  GetSettings: MethodDefinition<_braiins_bos_v1_GetSettingsRequest, _braiins_bos_v1_GetSettingsResponse, _braiins_bos_v1_GetSettingsRequest__Output, _braiins_bos_v1_GetSettingsResponse__Output>
  GetSettingsSchema: MethodDefinition<_braiins_bos_v1_GetSettingsSchemaRequest, _braiins_bos_v1_GetSettingsSchemaResponse, _braiins_bos_v1_GetSettingsSchemaRequest__Output, _braiins_bos_v1_GetSettingsSchemaResponse__Output>
  ResetAllSettings: MethodDefinition<_braiins_bos_v1_ResetAllSettingsRequest, _braiins_bos_v1_ResetAllSettingsResponse, _braiins_bos_v1_ResetAllSettingsRequest__Output, _braiins_bos_v1_ResetAllSettingsResponse__Output>
  SetSettings: MethodDefinition<_braiins_bos_v1_SetSettingsRequest, _braiins_bos_v1_SetSettingsResponse, _braiins_bos_v1_SetSettingsRequest__Output, _braiins_bos_v1_SetSettingsResponse__Output>
}
