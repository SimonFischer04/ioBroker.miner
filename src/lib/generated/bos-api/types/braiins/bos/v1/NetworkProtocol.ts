// Original file: bos/v1/network.proto

export const NetworkProtocol = {
  NETWORK_PROTOCOL_UNSPECIFIED: 0,
  NETWORK_PROTOCOL_DHCP: 1,
  NETWORK_PROTOCOL_STATIC: 2,
} as const;

export type NetworkProtocol =
  | 'NETWORK_PROTOCOL_UNSPECIFIED'
  | 0
  | 'NETWORK_PROTOCOL_DHCP'
  | 1
  | 'NETWORK_PROTOCOL_STATIC'
  | 2

export type NetworkProtocol__Output = typeof NetworkProtocol[keyof typeof NetworkProtocol]
