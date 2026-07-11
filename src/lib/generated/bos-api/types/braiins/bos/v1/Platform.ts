// Original file: bos/v1/miner.proto

export const Platform = {
  PLATFORM_UNSPECIFIED: 0,
  PLATFORM_AM1_S9: 1,
  PLATFORM_AM2_S17: 2,
  PLATFORM_AM3_BBB: 3,
  PLATFORM_AM3_AML: 4,
  PLATFORM_STM32MP157C_II1_AM2: 5,
  PLATFORM_CVITEK_BM1_AM2: 6,
  PLATFORM_ZYNQ_BM3_AM2: 7,
  PLATFORM_STM32MP157C_II2_BMM1: 8,
} as const;

export type Platform =
  | 'PLATFORM_UNSPECIFIED'
  | 0
  | 'PLATFORM_AM1_S9'
  | 1
  | 'PLATFORM_AM2_S17'
  | 2
  | 'PLATFORM_AM3_BBB'
  | 3
  | 'PLATFORM_AM3_AML'
  | 4
  | 'PLATFORM_STM32MP157C_II1_AM2'
  | 5
  | 'PLATFORM_CVITEK_BM1_AM2'
  | 6
  | 'PLATFORM_ZYNQ_BM3_AM2'
  | 7
  | 'PLATFORM_STM32MP157C_II2_BMM1'
  | 8

export type Platform__Output = typeof Platform[keyof typeof Platform]
