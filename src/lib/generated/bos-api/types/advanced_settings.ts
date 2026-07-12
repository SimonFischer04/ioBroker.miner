import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AdvancedSettingsServiceClient as _braiins_bos_v1_AdvancedSettingsServiceClient, AdvancedSettingsServiceDefinition as _braiins_bos_v1_AdvancedSettingsServiceDefinition } from './braiins/bos/v1/AdvancedSettingsService';
import type { GetSettingsRequest as _braiins_bos_v1_GetSettingsRequest, GetSettingsRequest__Output as _braiins_bos_v1_GetSettingsRequest__Output } from './braiins/bos/v1/GetSettingsRequest';
import type { GetSettingsResponse as _braiins_bos_v1_GetSettingsResponse, GetSettingsResponse__Output as _braiins_bos_v1_GetSettingsResponse__Output } from './braiins/bos/v1/GetSettingsResponse';
import type { GetSettingsSchemaRequest as _braiins_bos_v1_GetSettingsSchemaRequest, GetSettingsSchemaRequest__Output as _braiins_bos_v1_GetSettingsSchemaRequest__Output } from './braiins/bos/v1/GetSettingsSchemaRequest';
import type { GetSettingsSchemaResponse as _braiins_bos_v1_GetSettingsSchemaResponse, GetSettingsSchemaResponse__Output as _braiins_bos_v1_GetSettingsSchemaResponse__Output } from './braiins/bos/v1/GetSettingsSchemaResponse';
import type { ResetAllSettingsRequest as _braiins_bos_v1_ResetAllSettingsRequest, ResetAllSettingsRequest__Output as _braiins_bos_v1_ResetAllSettingsRequest__Output } from './braiins/bos/v1/ResetAllSettingsRequest';
import type { ResetAllSettingsResponse as _braiins_bos_v1_ResetAllSettingsResponse, ResetAllSettingsResponse__Output as _braiins_bos_v1_ResetAllSettingsResponse__Output } from './braiins/bos/v1/ResetAllSettingsResponse';
import type { SetSettingsRequest as _braiins_bos_v1_SetSettingsRequest, SetSettingsRequest__Output as _braiins_bos_v1_SetSettingsRequest__Output } from './braiins/bos/v1/SetSettingsRequest';
import type { SetSettingsResponse as _braiins_bos_v1_SetSettingsResponse, SetSettingsResponse__Output as _braiins_bos_v1_SetSettingsResponse__Output } from './braiins/bos/v1/SetSettingsResponse';
import type { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        AdvancedSettingsService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_AdvancedSettingsServiceClient> & { service: _braiins_bos_v1_AdvancedSettingsServiceDefinition }
        GetSettingsRequest: MessageTypeDefinition<_braiins_bos_v1_GetSettingsRequest, _braiins_bos_v1_GetSettingsRequest__Output>
        GetSettingsResponse: MessageTypeDefinition<_braiins_bos_v1_GetSettingsResponse, _braiins_bos_v1_GetSettingsResponse__Output>
        GetSettingsSchemaRequest: MessageTypeDefinition<_braiins_bos_v1_GetSettingsSchemaRequest, _braiins_bos_v1_GetSettingsSchemaRequest__Output>
        GetSettingsSchemaResponse: MessageTypeDefinition<_braiins_bos_v1_GetSettingsSchemaResponse, _braiins_bos_v1_GetSettingsSchemaResponse__Output>
        ResetAllSettingsRequest: MessageTypeDefinition<_braiins_bos_v1_ResetAllSettingsRequest, _braiins_bos_v1_ResetAllSettingsRequest__Output>
        ResetAllSettingsResponse: MessageTypeDefinition<_braiins_bos_v1_ResetAllSettingsResponse, _braiins_bos_v1_ResetAllSettingsResponse__Output>
        SetSettingsRequest: MessageTypeDefinition<_braiins_bos_v1_SetSettingsRequest, _braiins_bos_v1_SetSettingsRequest__Output>
        SetSettingsResponse: MessageTypeDefinition<_braiins_bos_v1_SetSettingsResponse, _braiins_bos_v1_SetSettingsResponse__Output>
      }
    }
  }
  google: {
    protobuf: {
      ListValue: MessageTypeDefinition<_google_protobuf_ListValue, _google_protobuf_ListValue__Output>
      NullValue: EnumTypeDefinition
      Struct: MessageTypeDefinition<_google_protobuf_Struct, _google_protobuf_Struct__Output>
      Value: MessageTypeDefinition<_google_protobuf_Value, _google_protobuf_Value__Output>
    }
  }
}

