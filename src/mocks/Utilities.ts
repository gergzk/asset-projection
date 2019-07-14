export const closeEnough = (actual: number, expected: number, decimals: number): void => {
    const factor = Math.round(Math.pow(10, decimals));
    const low = Math.floor(factor * expected) / factor;
    const high = Math.ceil(factor * expected) / factor;
    expect(actual).toBeGreaterThanOrEqual(low);
    expect(actual).toBeLessThanOrEqual(high);
}
