// Original file: bos/v1/miner.proto

export const ControlBoardSocFamily = {
  CONTROL_BOARD_SOC_FAMILY_UNSPECIFIED: 0,
  CONTROL_BOARD_SOC_FAMILY_CVITEK: 1,
  CONTROL_BOARD_SOC_FAMILY_BBB: 2,
  CONTROL_BOARD_SOC_FAMILY_AML: 3,
  CONTROL_BOARD_SOC_FAMILY_ZYNQ: 4,
  CONTROL_BOARD_SOC_FAMILY_BRAIINS: 5,
} as const;

export type ControlBoardSocFamily =
  | 'CONTROL_BOARD_SOC_FAMILY_UNSPECIFIED'
  | 0
  | 'CONTROL_BOARD_SOC_FAMILY_CVITEK'
  | 1
  | 'CONTROL_BOARD_SOC_FAMILY_BBB'
  | 2
  | 'CONTROL_BOARD_SOC_FAMILY_AML'
  | 3
  | 'CONTROL_BOARD_SOC_FAMILY_ZYNQ'
  | 4
  | 'CONTROL_BOARD_SOC_FAMILY_BRAIINS'
  | 5

export type ControlBoardSocFamily__Output = typeof ControlBoardSocFamily[keyof typeof ControlBoardSocFamily]
