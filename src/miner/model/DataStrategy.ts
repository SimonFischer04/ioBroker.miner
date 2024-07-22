export const dataStrategyKeys = [
    'poll',
    'push'
] as const;

export type DataStrategy = (typeof dataStrategyKeys)[number];