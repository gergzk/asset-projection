import PercentagePull from './PercentagePull';
import Cash from './Cash';
import { closeEnough } from '../mocks/Utilities';

describe('PercentagePull', () => {
    const cash = 'Cash';
    const amount1 = 1000;
    const incomes = (monthly: number) => { return { grossMonthly: () => monthly } as any };
    describe('consructor', () => {
        it('constructs', () => {
            expect(new PercentagePull([], new Cash(cash, 0), 8, 18500)).toBeTruthy();
        });
        it('Needs a destination', () => {
            expect(() => new PercentagePull([], null as any, 8, 18500)).toThrowError();
        });
    });
    describe('deposit', () => {
        it('passes through', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([], c, 8, 18500);
            pp.deposit(amount1);
            expect(c.cash()).toBe(amount1);
        });
        it('rejects too much', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([], c, 8, amount1 - 1);
            expect(() => pp.deposit(amount1)).toThrowError();
        });
    });
    describe('needs', () => {
        it('computes percentage without limit', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 0);
            expect(pp.needs()).toBe(800);
        });
        it('computes percentage', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 18500);
            expect(pp.needs()).toBe(800);
        });
        it('respects yearly cap', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 1000);
            pp.deposit(800);
            pp.tick();
            closeEnough(pp.needs(), 200, 2);
        });
        it('end to end', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 1000);
            for (let i = 0; i < 5; i++) {
                // enough loops to hit every case
                pp.deposit(pp.needs());
                pp.tick();    
            }
            closeEnough(c.cash(), 1000, 2);
        });
    });
    describe('tick', () => {
        it('resets each year', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 1000);
            for (let i = 0; i < 13; i++) {
                // 1 year and 1 month. We should see a reset and another January infusion
                pp.deposit(pp.needs());
                pp.tick();    
            }
            closeEnough(c.cash(), 1800, 2);
        });
    });
    describe('dead API', () => {
        it('cash returns zero', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 1000);
            expect(pp.cash()).toBe(0);
        });
        it('value returns zero', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 1000);
            expect(pp.value()).toBe(0);
        });
        it('liquidate throws', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 1000);
            expect(() => pp.liquidate()).toThrowError();
        });
        it('withdraw throws', () => {
            const c = new Cash(cash, 0);
            const pp = new PercentagePull([incomes(10000)], c, 8, 1000);
            expect(() => pp.withdraw(amount1)).toThrowError();
        });
    });
});
