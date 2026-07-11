// Original file: bos/v1/network.proto

import type { Dhcp as _braiins_bos_v1_Dhcp, Dhcp__Output as _braiins_bos_v1_Dhcp__Output } from '../../../braiins/bos/v1/Dhcp';
import type { Static as _braiins_bos_v1_Static, Static__Output as _braiins_bos_v1_Static__Output } from '../../../braiins/bos/v1/Static';

export interface NetworkConfiguration {
  'dhcp'?: (_braiins_bos_v1_Dhcp | null);
  'static'?: (_braiins_bos_v1_Static | null);
  'hostname'?: (string);
  'protocol'?: "dhcp"|"static";
}

export interface NetworkConfiguration__Output {
  'dhcp'?: (_braiins_bos_v1_Dhcp__Output);
  'static'?: (_braiins_bos_v1_Static__Output);
  'hostname'?: (string);
  'protocol'?: "dhcp"|"static";
}
