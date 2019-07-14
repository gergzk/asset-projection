import Income from './Income';
import Salary from './Salary';
import Cash from './Cash';
import { closeEnough } from '../mocks/Utilities';
import PercentagePull from './PercentagePull';

describe('Income', () => {
    const label = 'Family income';
    const linkedAccount = () => new Cash('Linked account', 0);
    const salary = (gross: number) => new Salary('Base pay', gross, 3);
    const dollars1 = 5000;
    const dollars2 = 3000;
    const dollars3 = 15000;

    describe('constructor', () => {
        it('constructs', () => {
            expect(new Income(label, [], linkedAccount(), 25, [], [])).toBeTruthy();
        });
        it('fails without linked account', () => {
            expect(() => new Income(label, [], null as any, 25, [], [])).toThrowError();
        });
    });
    describe('tick', () => {
        describe('qualitative', () => {
            it('ticks all income streams', () => {
                const salary1 = salary(dollars1);
                const salary2 = salary(dollars2);
                let ticked1 = false; let ticked2 = false;
                salary1.tick = () => { ticked1 = true; };
                salary2.tick = () => { ticked2 = true; };
                const income = new Income(label, [salary1, salary2], linkedAccount(), 25, [], []);
                income.tick();
                expect(ticked1 && ticked2).toBe(true);
            });
            it('pushes money into linked account', () => {
                const s = salary(dollars1);
                const la = linkedAccount();
                const income = new Income(label, [s], la, 25, [], []);
                income.tick();
                expect(la.cash()).toBeGreaterThan(0);
                expect(la.cash()).toBeLessThan(5000);
            });
            it('keeps pushing money into linked account', () => {
                const s = salary(dollars1);
                const la = linkedAccount();
                const income = new Income(label, [s], la, 25, [], []);
                income.tick();
                const first = la.cash();
                income.tick();
                expect(la.cash()).toBeGreaterThan(first);
            });
        });
        describe('quantitative', () => {
            describe('under fica limit', () => {
                it('single month', () => {
                    const s = salary(dollars1);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [], []);
                    income.tick();
                    // 25 + 2.9 + 6.2 percent should be deducted.
                    const expected = (1 - (.25 + 0.029 + 0.062)) * dollars1;
                    closeEnough(la.cash(), expected, 2);
                });
                it('twelve months', () => {
                    const s = salary(dollars1);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [], []);
                    for (let i = 0; i < 12; i++) { income.tick(); }
                    // 25 + 2.9 + 6.2 percent should be deducted.
                    const expected = (1 - (.25 + 0.029 + 0.062)) * dollars1 * 12;
                    closeEnough(la.cash(), expected, 2);
                });
                it('single month with pretax account', () => {
                    const s = salary(dollars1);
                    const c = new Cash('Cash', 0);
                    const pp = new PercentagePull([s], c, 10, 18500);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [], [pp]);
                    income.tick();
                    // 955 goes to fica, medicare, pretax savings.
                    // 4500 is left to tax at 25% (1125)
                    // so 2080 is gone, and cash should receive 2920
                    closeEnough(la.cash(), 2920, 2);
                    closeEnough(c.cash(), dollars1 * 0.1, 2);
                });
                it('single month with pretax account drawing too much', () => {
                    const s = salary(dollars1);
                    const c = new Cash('Cash', 0);
                    const pp = new PercentagePull([s], c, 101, 18500);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [], [pp]);
                    expect(() => income.tick()).toThrowError();
                });
                it('single month with posttax account drawing too much', () => {
                    const s = salary(dollars1);
                    const c = new Cash('Cash', 0);
                    const pp = new PercentagePull([s], c, 101, 18500);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [pp], []);
                    expect(() => income.tick()).toThrowError();
                });
                it('single month with posttax account', () => {
                    const s = salary(dollars1);
                    const c = new Cash('Cash', 0);
                    const pp = new PercentagePull([s], c, 10, 18500);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [pp], []);
                    income.tick();
                    // 955 goes to fica, medicare, pretax savings.
                    // 5000 is left to tax at 25% (1250)
                    // so 2205 is gone, and cash should receive 2795
                    closeEnough(la.cash(), 2795, 2);
                    closeEnough(c.cash(), dollars1 * 0.1, 2);
                });
                it('single month with pretax and posttax account', () => {
                    const s = salary(dollars1);
                    const c1 = new Cash('Cash', 0);
                    const c2 = new Cash('Cash', 0);
                    const pppost = new PercentagePull([s], c1, 7, 20000);
                    const pppre = new PercentagePull([s], c2, 10, 18500);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [pppost], [pppre]);
                    income.tick();
                    // 955 goes to fica, medicare, pretax savings.
                    // 4500 is left to tax at 25% (1125), of which 350 goes to pppost
                    // so 2430 is gone, and cash should receive 2570
                    closeEnough(la.cash(), 2570, 2);
                    closeEnough(c1.cash(), dollars1 * 0.07, 2);
                    closeEnough(c2.cash(), dollars1 * 0.1, 2);
                });
            });
            describe('over fica limit', () => {
                it('single month', () => {
                    const s = salary(dollars3);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [], []);
                    income.tick();
                    // 25 + 2.9 + 6.2 percent should be deducted.
                    const expected = (1 - (.25 + 0.029 + 0.062)) * dollars3;
                    closeEnough(la.cash(), expected, 2);
                });
                it('twelve months', () => {
                    const s = salary(dollars3);
                    const la = linkedAccount();
                    const income = new Income(label, [s], la, 25, [], []);
                    for (let i = 0; i < 12; i++) { income.tick(); }
                    // 25 + 2.9 + 6.2 percent should be deducted from the first 118500
                    // and 25 + 2.9 should be deducted from the rest (61500)
                    const expected = 180000 - (0.25 + 0.062 + 0.029) * 118500 - (0.25 + 0.029) * 61500;
                    closeEnough(la.cash(), expected, 2);
                });
            });
        });
    });
});
