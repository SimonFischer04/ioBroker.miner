// Original file: bos/v1/network.proto

import type { NetworkProtocol as _braiins_bos_v1_NetworkProtocol, NetworkProtocol__Output as _braiins_bos_v1_NetworkProtocol__Output } from '../../../braiins/bos/v1/NetworkProtocol';
import type { IpNetwork as _braiins_bos_v1_IpNetwork, IpNetwork__Output as _braiins_bos_v1_IpNetwork__Output } from '../../../braiins/bos/v1/IpNetwork';

export interface GetNetworkInfoResponse {
  'name'?: (string);
  'macAddress'?: (string);
  'hostname'?: (string);
  'protocol'?: (_braiins_bos_v1_NetworkProtocol);
  'dnsServers'?: (string)[];
  'networks'?: (_braiins_bos_v1_IpNetwork)[];
  'defaultGateway'?: (string);
  '_macAddress'?: "macAddress";
  '_hostname'?: "hostname";
  '_protocol'?: "protocol";
  '_defaultGateway'?: "defaultGateway";
}

export interface GetNetworkInfoResponse__Output {
  'name'?: (string);
  'macAddress'?: (string);
  'hostname'?: (string);
  'protocol'?: (_braiins_bos_v1_NetworkProtocol__Output);
  'dnsServers'?: (string)[];
  'networks'?: (_braiins_bos_v1_IpNetwork__Output)[];
  'defaultGateway'?: (string);
  '_macAddress'?: "macAddress";
  '_hostname'?: "hostname";
  '_protocol'?: "protocol";
  '_defaultGateway'?: "defaultGateway";
}
