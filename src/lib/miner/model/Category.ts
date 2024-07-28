export const categoryKeys = [
    'miner',
    'pool'
] as const;

export type Category = (typeof categoryKeys)[number];