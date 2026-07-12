// Original file: bos/v1/miner.proto

export const MinerBrand = {
  MINER_BRAND_UNSPECIFIED: 0,
  MINER_BRAND_ANTMINER: 1,
  MINER_BRAND_WHATSMINER: 2,
} as const;

export type MinerBrand =
  | 'MINER_BRAND_UNSPECIFIED'
  | 0
  | 'MINER_BRAND_ANTMINER'
  | 1
  | 'MINER_BRAND_WHATSMINER'
  | 2

export type MinerBrand__Output = typeof MinerBrand[keyof typeof MinerBrand]
