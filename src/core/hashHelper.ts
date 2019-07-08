export const stableHashPair = (hash1: number, hash2: number) => {
    const min = Math.min(hash1, hash2);
    const max = Math.max(hash1, hash2);

    return (23 + 27 * min) + 37 * max;
}