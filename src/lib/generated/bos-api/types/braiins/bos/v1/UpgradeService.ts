// Original file: bos/v1/upgrade.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { GetAutoUpgradeStatusRequest as _braiins_bos_v1_GetAutoUpgradeStatusRequest, GetAutoUpgradeStatusRequest__Output as _braiins_bos_v1_GetAutoUpgradeStatusRequest__Output } from '../../../braiins/bos/v1/GetAutoUpgradeStatusRequest';
import type { GetAutoUpgradeStatusResponse as _braiins_bos_v1_GetAutoUpgradeStatusResponse, GetAutoUpgradeStatusResponse__Output as _braiins_bos_v1_GetAutoUpgradeStatusResponse__Output } from '../../../braiins/bos/v1/GetAutoUpgradeStatusResponse';
import type { RestoreStockRequest as _braiins_bos_v1_RestoreStockRequest, RestoreStockRequest__Output as _braiins_bos_v1_RestoreStockRequest__Output } from '../../../braiins/bos/v1/RestoreStockRequest';
import type { RestoreStockResponse as _braiins_bos_v1_RestoreStockResponse, RestoreStockResponse__Output as _braiins_bos_v1_RestoreStockResponse__Output } from '../../../braiins/bos/v1/RestoreStockResponse';
import type { SystemUpgradeRequest as _braiins_bos_v1_SystemUpgradeRequest, SystemUpgradeRequest__Output as _braiins_bos_v1_SystemUpgradeRequest__Output } from '../../../braiins/bos/v1/SystemUpgradeRequest';
import type { SystemUpgradeResponse as _braiins_bos_v1_SystemUpgradeResponse, SystemUpgradeResponse__Output as _braiins_bos_v1_SystemUpgradeResponse__Output } from '../../../braiins/bos/v1/SystemUpgradeResponse';
import type { UpdateAutoUpgradeConfigRequest as _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, UpdateAutoUpgradeConfigRequest__Output as _braiins_bos_v1_UpdateAutoUpgradeConfigRequest__Output } from '../../../braiins/bos/v1/UpdateAutoUpgradeConfigRequest';
import type { UpdateAutoUpgradeConfigResponse as _braiins_bos_v1_UpdateAutoUpgradeConfigResponse, UpdateAutoUpgradeConfigResponse__Output as _braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output } from '../../../braiins/bos/v1/UpdateAutoUpgradeConfigResponse';

export interface UpgradeServiceClient extends grpc.Client {
  GetAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  GetAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  GetAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  GetAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  getAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  getAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  getAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  getAutoUpgradeStatus(argument: _braiins_bos_v1_GetAutoUpgradeStatusRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>): grpc.ClientUnaryCall;
  
  RestoreStock(argument: _braiins_bos_v1_RestoreStockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  RestoreStock(argument: _braiins_bos_v1_RestoreStockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  RestoreStock(argument: _braiins_bos_v1_RestoreStockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  RestoreStock(argument: _braiins_bos_v1_RestoreStockRequest, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  restoreStock(argument: _braiins_bos_v1_RestoreStockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  restoreStock(argument: _braiins_bos_v1_RestoreStockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  restoreStock(argument: _braiins_bos_v1_RestoreStockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  restoreStock(argument: _braiins_bos_v1_RestoreStockRequest, callback: grpc.requestCallback<_braiins_bos_v1_RestoreStockResponse__Output>): grpc.ClientUnaryCall;
  
  SystemUpgrade(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  SystemUpgrade(metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  SystemUpgrade(options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  SystemUpgrade(callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  systemUpgrade(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  systemUpgrade(metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  systemUpgrade(options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  systemUpgrade(callback: grpc.requestCallback<_braiins_bos_v1_SystemUpgradeResponse__Output>): grpc.ClientWritableStream<_braiins_bos_v1_SystemUpgradeRequest>;
  
  UpdateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  UpdateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  UpdateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  UpdateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  updateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  updateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  updateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  updateAutoUpgradeConfig(argument: _braiins_bos_v1_UpdateAutoUpgradeConfigRequest, callback: grpc.requestCallback<_braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface UpgradeServiceHandlers extends grpc.UntypedServiceImplementation {
  GetAutoUpgradeStatus: grpc.handleUnaryCall<_braiins_bos_v1_GetAutoUpgradeStatusRequest__Output, _braiins_bos_v1_GetAutoUpgradeStatusResponse>;
  
  RestoreStock: grpc.handleUnaryCall<_braiins_bos_v1_RestoreStockRequest__Output, _braiins_bos_v1_RestoreStockResponse>;
  
  SystemUpgrade: grpc.handleClientStreamingCall<_braiins_bos_v1_SystemUpgradeRequest__Output, _braiins_bos_v1_SystemUpgradeResponse>;
  
  UpdateAutoUpgradeConfig: grpc.handleUnaryCall<_braiins_bos_v1_UpdateAutoUpgradeConfigRequest__Output, _braiins_bos_v1_UpdateAutoUpgradeConfigResponse>;
  
}

export interface UpgradeServiceDefinition extends grpc.ServiceDefinition {
  GetAutoUpgradeStatus: MethodDefinition<_braiins_bos_v1_GetAutoUpgradeStatusRequest, _braiins_bos_v1_GetAutoUpgradeStatusResponse, _braiins_bos_v1_GetAutoUpgradeStatusRequest__Output, _braiins_bos_v1_GetAutoUpgradeStatusResponse__Output>
  RestoreStock: MethodDefinition<_braiins_bos_v1_RestoreStockRequest, _braiins_bos_v1_RestoreStockResponse, _braiins_bos_v1_RestoreStockRequest__Output, _braiins_bos_v1_RestoreStockResponse__Output>
  SystemUpgrade: MethodDefinition<_braiins_bos_v1_SystemUpgradeRequest, _braiins_bos_v1_SystemUpgradeResponse, _braiins_bos_v1_SystemUpgradeRequest__Output, _braiins_bos_v1_SystemUpgradeResponse__Output>
  UpdateAutoUpgradeConfig: MethodDefinition<_braiins_bos_v1_UpdateAutoUpgradeConfigRequest, _braiins_bos_v1_UpdateAutoUpgradeConfigResponse, _braiins_bos_v1_UpdateAutoUpgradeConfigRequest__Output, _braiins_bos_v1_UpdateAutoUpgradeConfigResponse__Output>
}
