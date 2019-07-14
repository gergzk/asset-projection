import AnnualBonus from './AnnualBonus';

describe('AnnualBonus', () => {
    const label = 'Bonus';
    const gross = 10000;
    describe('grossMonthly', () => {
        it('is zero at start', () => {
            const a = new AnnualBonus(label, gross);
            a.tick();
            expect(a.grossMonthly()).toBe(0);
        });
        it('is zero at month 7', () => {
            const a = new AnnualBonus(label, gross, 6);
            a.tick();
            expect(a.grossMonthly()).toBe(0);
        });
        it('is paid in month 12', () => {
            const a = new AnnualBonus(label, gross, 11);
            a.tick();
            expect(a.grossMonthly()).toBe(gross);
        });
    });
});
