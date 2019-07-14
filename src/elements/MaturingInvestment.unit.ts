import MaturingInvestment from './MaturingInvestment';

describe('MaturingInvestment', () => {
    const label = 'Investment ... someday';
    describe('constructor', () => {
        it('constructs', () => {
            expect(new MaturingInvestment(label, 10000, 8, 20 * 12)).toBeTruthy();
        });
    });
    describe('cash', () => {
        it('zero until mature', () => {
            const mi = new MaturingInvestment(label, 10000, 8, 20 * 12);
            expect(mi.cash()).toBe(0);
        });
        it('non-zero once mature', () => {
            const ticks = 10;
            const mi = new MaturingInvestment(label, 10000, 8, ticks);
            for (let i = 0; i < ticks; i++) { mi.tick(); }
            expect(mi.cash()).toBeGreaterThan(0);
        });
    });
});
