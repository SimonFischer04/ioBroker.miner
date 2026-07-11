import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { ApiVersion as _braiins_bos_ApiVersion, ApiVersion__Output as _braiins_bos_ApiVersion__Output } from './braiins/bos/ApiVersion';
import type { ApiVersionRequest as _braiins_bos_ApiVersionRequest, ApiVersionRequest__Output as _braiins_bos_ApiVersionRequest__Output } from './braiins/bos/ApiVersionRequest';
import type { ApiVersionServiceClient as _braiins_bos_ApiVersionServiceClient, ApiVersionServiceDefinition as _braiins_bos_ApiVersionServiceDefinition } from './braiins/bos/ApiVersionService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      ApiVersion: MessageTypeDefinition<_braiins_bos_ApiVersion, _braiins_bos_ApiVersion__Output>
      ApiVersionRequest: MessageTypeDefinition<_braiins_bos_ApiVersionRequest, _braiins_bos_ApiVersionRequest__Output>
      ApiVersionService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_ApiVersionServiceClient> & { service: _braiins_bos_ApiVersionServiceDefinition }
    }
  }
}

