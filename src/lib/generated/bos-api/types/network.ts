import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { Dhcp as _braiins_bos_v1_Dhcp, Dhcp__Output as _braiins_bos_v1_Dhcp__Output } from './braiins/bos/v1/Dhcp';
import type { GetNetworkConfigurationRequest as _braiins_bos_v1_GetNetworkConfigurationRequest, GetNetworkConfigurationRequest__Output as _braiins_bos_v1_GetNetworkConfigurationRequest__Output } from './braiins/bos/v1/GetNetworkConfigurationRequest';
import type { GetNetworkConfigurationResponse as _braiins_bos_v1_GetNetworkConfigurationResponse, GetNetworkConfigurationResponse__Output as _braiins_bos_v1_GetNetworkConfigurationResponse__Output } from './braiins/bos/v1/GetNetworkConfigurationResponse';
import type { GetNetworkInfoRequest as _braiins_bos_v1_GetNetworkInfoRequest, GetNetworkInfoRequest__Output as _braiins_bos_v1_GetNetworkInfoRequest__Output } from './braiins/bos/v1/GetNetworkInfoRequest';
import type { GetNetworkInfoResponse as _braiins_bos_v1_GetNetworkInfoResponse, GetNetworkInfoResponse__Output as _braiins_bos_v1_GetNetworkInfoResponse__Output } from './braiins/bos/v1/GetNetworkInfoResponse';
import type { IpNetwork as _braiins_bos_v1_IpNetwork, IpNetwork__Output as _braiins_bos_v1_IpNetwork__Output } from './braiins/bos/v1/IpNetwork';
import type { NetworkConfiguration as _braiins_bos_v1_NetworkConfiguration, NetworkConfiguration__Output as _braiins_bos_v1_NetworkConfiguration__Output } from './braiins/bos/v1/NetworkConfiguration';
import type { NetworkServiceClient as _braiins_bos_v1_NetworkServiceClient, NetworkServiceDefinition as _braiins_bos_v1_NetworkServiceDefinition } from './braiins/bos/v1/NetworkService';
import type { SetNetworkConfigurationRequest as _braiins_bos_v1_SetNetworkConfigurationRequest, SetNetworkConfigurationRequest__Output as _braiins_bos_v1_SetNetworkConfigurationRequest__Output } from './braiins/bos/v1/SetNetworkConfigurationRequest';
import type { SetNetworkConfigurationResponse as _braiins_bos_v1_SetNetworkConfigurationResponse, SetNetworkConfigurationResponse__Output as _braiins_bos_v1_SetNetworkConfigurationResponse__Output } from './braiins/bos/v1/SetNetworkConfigurationResponse';
import type { Static as _braiins_bos_v1_Static, Static__Output as _braiins_bos_v1_Static__Output } from './braiins/bos/v1/Static';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  braiins: {
    bos: {
      v1: {
        Dhcp: MessageTypeDefinition<_braiins_bos_v1_Dhcp, _braiins_bos_v1_Dhcp__Output>
        GetNetworkConfigurationRequest: MessageTypeDefinition<_braiins_bos_v1_GetNetworkConfigurationRequest, _braiins_bos_v1_GetNetworkConfigurationRequest__Output>
        GetNetworkConfigurationResponse: MessageTypeDefinition<_braiins_bos_v1_GetNetworkConfigurationResponse, _braiins_bos_v1_GetNetworkConfigurationResponse__Output>
        GetNetworkInfoRequest: MessageTypeDefinition<_braiins_bos_v1_GetNetworkInfoRequest, _braiins_bos_v1_GetNetworkInfoRequest__Output>
        GetNetworkInfoResponse: MessageTypeDefinition<_braiins_bos_v1_GetNetworkInfoResponse, _braiins_bos_v1_GetNetworkInfoResponse__Output>
        IpNetwork: MessageTypeDefinition<_braiins_bos_v1_IpNetwork, _braiins_bos_v1_IpNetwork__Output>
        NetworkConfiguration: MessageTypeDefinition<_braiins_bos_v1_NetworkConfiguration, _braiins_bos_v1_NetworkConfiguration__Output>
        NetworkProtocol: EnumTypeDefinition
        NetworkService: SubtypeConstructor<typeof grpc.Client, _braiins_bos_v1_NetworkServiceClient> & { service: _braiins_bos_v1_NetworkServiceDefinition }
        SetNetworkConfigurationRequest: MessageTypeDefinition<_braiins_bos_v1_SetNetworkConfigurationRequest, _braiins_bos_v1_SetNetworkConfigurationRequest__Output>
        SetNetworkConfigurationResponse: MessageTypeDefinition<_braiins_bos_v1_SetNetworkConfigurationResponse, _braiins_bos_v1_SetNetworkConfigurationResponse__Output>
        Static: MessageTypeDefinition<_braiins_bos_v1_Static, _braiins_bos_v1_Static__Output>
      }
    }
  }
}

