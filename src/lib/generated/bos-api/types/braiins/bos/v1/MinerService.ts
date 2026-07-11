// Original file: bos/v1/miner.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DisableHashboardsRequest as _braiins_bos_v1_DisableHashboardsRequest, DisableHashboardsRequest__Output as _braiins_bos_v1_DisableHashboardsRequest__Output } from '../../../braiins/bos/v1/DisableHashboardsRequest';
import type { DisableHashboardsResponse as _braiins_bos_v1_DisableHashboardsResponse, DisableHashboardsResponse__Output as _braiins_bos_v1_DisableHashboardsResponse__Output } from '../../../braiins/bos/v1/DisableHashboardsResponse';
import type { EnableHashboardsRequest as _braiins_bos_v1_EnableHashboardsRequest, EnableHashboardsRequest__Output as _braiins_bos_v1_EnableHashboardsRequest__Output } from '../../../braiins/bos/v1/EnableHashboardsRequest';
import type { EnableHashboardsResponse as _braiins_bos_v1_EnableHashboardsResponse, EnableHashboardsResponse__Output as _braiins_bos_v1_EnableHashboardsResponse__Output } from '../../../braiins/bos/v1/EnableHashboardsResponse';
import type { GetErrorsRequest as _braiins_bos_v1_GetErrorsRequest, GetErrorsRequest__Output as _braiins_bos_v1_GetErrorsRequest__Output } from '../../../braiins/bos/v1/GetErrorsRequest';
import type { GetErrorsResponse as _braiins_bos_v1_GetErrorsResponse, GetErrorsResponse__Output as _braiins_bos_v1_GetErrorsResponse__Output } from '../../../braiins/bos/v1/GetErrorsResponse';
import type { GetHashboardsRequest as _braiins_bos_v1_GetHashboardsRequest, GetHashboardsRequest__Output as _braiins_bos_v1_GetHashboardsRequest__Output } from '../../../braiins/bos/v1/GetHashboardsRequest';
import type { GetHashboardsResponse as _braiins_bos_v1_GetHashboardsResponse, GetHashboardsResponse__Output as _braiins_bos_v1_GetHashboardsResponse__Output } from '../../../braiins/bos/v1/GetHashboardsResponse';
import type { GetLogRequest as _braiins_bos_v1_GetLogRequest, GetLogRequest__Output as _braiins_bos_v1_GetLogRequest__Output } from '../../../braiins/bos/v1/GetLogRequest';
import type { GetLogResponse as _braiins_bos_v1_GetLogResponse, GetLogResponse__Output as _braiins_bos_v1_GetLogResponse__Output } from '../../../braiins/bos/v1/GetLogResponse';
import type { GetMinerDetailsRequest as _braiins_bos_v1_GetMinerDetailsRequest, GetMinerDetailsRequest__Output as _braiins_bos_v1_GetMinerDetailsRequest__Output } from '../../../braiins/bos/v1/GetMinerDetailsRequest';
import type { GetMinerDetailsResponse as _braiins_bos_v1_GetMinerDetailsResponse, GetMinerDetailsResponse__Output as _braiins_bos_v1_GetMinerDetailsResponse__Output } from '../../../braiins/bos/v1/GetMinerDetailsResponse';
import type { GetMinerStatsRequest as _braiins_bos_v1_GetMinerStatsRequest, GetMinerStatsRequest__Output as _braiins_bos_v1_GetMinerStatsRequest__Output } from '../../../braiins/bos/v1/GetMinerStatsRequest';
import type { GetMinerStatsResponse as _braiins_bos_v1_GetMinerStatsResponse, GetMinerStatsResponse__Output as _braiins_bos_v1_GetMinerStatsResponse__Output } from '../../../braiins/bos/v1/GetMinerStatsResponse';
import type { GetMinerStatusRequest as _braiins_bos_v1_GetMinerStatusRequest, GetMinerStatusRequest__Output as _braiins_bos_v1_GetMinerStatusRequest__Output } from '../../../braiins/bos/v1/GetMinerStatusRequest';
import type { GetMinerStatusResponse as _braiins_bos_v1_GetMinerStatusResponse, GetMinerStatusResponse__Output as _braiins_bos_v1_GetMinerStatusResponse__Output } from '../../../braiins/bos/v1/GetMinerStatusResponse';
import type { GetSupportArchiveRequest as _braiins_bos_v1_GetSupportArchiveRequest, GetSupportArchiveRequest__Output as _braiins_bos_v1_GetSupportArchiveRequest__Output } from '../../../braiins/bos/v1/GetSupportArchiveRequest';
import type { GetSupportArchiveResponse as _braiins_bos_v1_GetSupportArchiveResponse, GetSupportArchiveResponse__Output as _braiins_bos_v1_GetSupportArchiveResponse__Output } from '../../../braiins/bos/v1/GetSupportArchiveResponse';

export interface MinerServiceClient extends grpc.Client {
  DisableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  DisableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  DisableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  DisableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  disableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  disableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  disableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  disableHashboards(argument: _braiins_bos_v1_DisableHashboardsRequest, callback: grpc.requestCallback<_braiins_bos_v1_DisableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  
  EnableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  EnableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  EnableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  EnableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  enableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  enableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  enableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  enableHashboards(argument: _braiins_bos_v1_EnableHashboardsRequest, callback: grpc.requestCallback<_braiins_bos_v1_EnableHashboardsResponse__Output>): grpc.ClientUnaryCall;
  
  GetErrors(argument: _braiins_bos_v1_GetErrorsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  GetErrors(argument: _braiins_bos_v1_GetErrorsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  GetErrors(argument: _braiins_bos_v1_GetErrorsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  GetErrors(argument: _braiins_bos_v1_GetErrorsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  getErrors(argument: _braiins_bos_v1_GetErrorsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  getErrors(argument: _braiins_bos_v1_GetErrorsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  getErrors(argument: _braiins_bos_v1_GetErrorsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  getErrors(argument: _braiins_bos_v1_GetErrorsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetErrorsResponse__Output>): grpc.ClientUnaryCall;
  
  GetHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  GetHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  GetHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  GetHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  getHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  getHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  getHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  getHashboards(argument: _braiins_bos_v1_GetHashboardsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetHashboardsResponse__Output>): grpc.ClientUnaryCall;
  
  GetLog(argument: _braiins_bos_v1_GetLogRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetLogResponse__Output>;
  GetLog(argument: _braiins_bos_v1_GetLogRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetLogResponse__Output>;
  getLog(argument: _braiins_bos_v1_GetLogRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetLogResponse__Output>;
  getLog(argument: _braiins_bos_v1_GetLogRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetLogResponse__Output>;
  
  GetMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  GetMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  GetMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  GetMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  getMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  getMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  getMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  getMinerDetails(argument: _braiins_bos_v1_GetMinerDetailsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerDetailsResponse__Output>): grpc.ClientUnaryCall;
  
  GetMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  GetMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  GetMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  GetMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  getMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  getMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  getMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  getMinerStats(argument: _braiins_bos_v1_GetMinerStatsRequest, callback: grpc.requestCallback<_braiins_bos_v1_GetMinerStatsResponse__Output>): grpc.ClientUnaryCall;
  
  GetMinerStatus(argument: _braiins_bos_v1_GetMinerStatusRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetMinerStatusResponse__Output>;
  GetMinerStatus(argument: _braiins_bos_v1_GetMinerStatusRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetMinerStatusResponse__Output>;
  getMinerStatus(argument: _braiins_bos_v1_GetMinerStatusRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetMinerStatusResponse__Output>;
  getMinerStatus(argument: _braiins_bos_v1_GetMinerStatusRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetMinerStatusResponse__Output>;
  
  GetSupportArchive(argument: _braiins_bos_v1_GetSupportArchiveRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetSupportArchiveResponse__Output>;
  GetSupportArchive(argument: _braiins_bos_v1_GetSupportArchiveRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetSupportArchiveResponse__Output>;
  getSupportArchive(argument: _braiins_bos_v1_GetSupportArchiveRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetSupportArchiveResponse__Output>;
  getSupportArchive(argument: _braiins_bos_v1_GetSupportArchiveRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_braiins_bos_v1_GetSupportArchiveResponse__Output>;
  
}

export interface MinerServiceHandlers extends grpc.UntypedServiceImplementation {
  DisableHashboards: grpc.handleUnaryCall<_braiins_bos_v1_DisableHashboardsRequest__Output, _braiins_bos_v1_DisableHashboardsResponse>;
  
  EnableHashboards: grpc.handleUnaryCall<_braiins_bos_v1_EnableHashboardsRequest__Output, _braiins_bos_v1_EnableHashboardsResponse>;
  
  GetErrors: grpc.handleUnaryCall<_braiins_bos_v1_GetErrorsRequest__Output, _braiins_bos_v1_GetErrorsResponse>;
  
  GetHashboards: grpc.handleUnaryCall<_braiins_bos_v1_GetHashboardsRequest__Output, _braiins_bos_v1_GetHashboardsResponse>;
  
  GetLog: grpc.handleServerStreamingCall<_braiins_bos_v1_GetLogRequest__Output, _braiins_bos_v1_GetLogResponse>;
  
  GetMinerDetails: grpc.handleUnaryCall<_braiins_bos_v1_GetMinerDetailsRequest__Output, _braiins_bos_v1_GetMinerDetailsResponse>;
  
  GetMinerStats: grpc.handleUnaryCall<_braiins_bos_v1_GetMinerStatsRequest__Output, _braiins_bos_v1_GetMinerStatsResponse>;
  
  GetMinerStatus: grpc.handleServerStreamingCall<_braiins_bos_v1_GetMinerStatusRequest__Output, _braiins_bos_v1_GetMinerStatusResponse>;
  
  GetSupportArchive: grpc.handleServerStreamingCall<_braiins_bos_v1_GetSupportArchiveRequest__Output, _braiins_bos_v1_GetSupportArchiveResponse>;
  
}

export interface MinerServiceDefinition extends grpc.ServiceDefinition {
  DisableHashboards: MethodDefinition<_braiins_bos_v1_DisableHashboardsRequest, _braiins_bos_v1_DisableHashboardsResponse, _braiins_bos_v1_DisableHashboardsRequest__Output, _braiins_bos_v1_DisableHashboardsResponse__Output>
  EnableHashboards: MethodDefinition<_braiins_bos_v1_EnableHashboardsRequest, _braiins_bos_v1_EnableHashboardsResponse, _braiins_bos_v1_EnableHashboardsRequest__Output, _braiins_bos_v1_EnableHashboardsResponse__Output>
  GetErrors: MethodDefinition<_braiins_bos_v1_GetErrorsRequest, _braiins_bos_v1_GetErrorsResponse, _braiins_bos_v1_GetErrorsRequest__Output, _braiins_bos_v1_GetErrorsResponse__Output>
  GetHashboards: MethodDefinition<_braiins_bos_v1_GetHashboardsRequest, _braiins_bos_v1_GetHashboardsResponse, _braiins_bos_v1_GetHashboardsRequest__Output, _braiins_bos_v1_GetHashboardsResponse__Output>
  GetLog: MethodDefinition<_braiins_bos_v1_GetLogRequest, _braiins_bos_v1_GetLogResponse, _braiins_bos_v1_GetLogRequest__Output, _braiins_bos_v1_GetLogResponse__Output>
  GetMinerDetails: MethodDefinition<_braiins_bos_v1_GetMinerDetailsRequest, _braiins_bos_v1_GetMinerDetailsResponse, _braiins_bos_v1_GetMinerDetailsRequest__Output, _braiins_bos_v1_GetMinerDetailsResponse__Output>
  GetMinerStats: MethodDefinition<_braiins_bos_v1_GetMinerStatsRequest, _braiins_bos_v1_GetMinerStatsResponse, _braiins_bos_v1_GetMinerStatsRequest__Output, _braiins_bos_v1_GetMinerStatsResponse__Output>
  GetMinerStatus: MethodDefinition<_braiins_bos_v1_GetMinerStatusRequest, _braiins_bos_v1_GetMinerStatusResponse, _braiins_bos_v1_GetMinerStatusRequest__Output, _braiins_bos_v1_GetMinerStatusResponse__Output>
  GetSupportArchive: MethodDefinition<_braiins_bos_v1_GetSupportArchiveRequest, _braiins_bos_v1_GetSupportArchiveResponse, _braiins_bos_v1_GetSupportArchiveRequest__Output, _braiins_bos_v1_GetSupportArchiveResponse__Output>
}
