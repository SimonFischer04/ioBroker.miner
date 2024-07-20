export const categories = {
    miner: 'Miner',
    pool: 'Pool'
} as const;

export type Category = keyof typeof categories;

export function categoryKeys(): Category[] {
    return Object.keys(categories) as Category[];
}

export default {}