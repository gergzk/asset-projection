import Investment from './Investment';
import { closeEnough } from '../mocks/Utilities';

describe('Investment', () => {
    const label = 'Investment account';
    const balance = 10000;
    const lessThanBalance = 5000;
    const moreThanBalance = 20000;
    const negativeNum = -1000;
    describe('Constructor', () => {
        it('Constructs', () => {
            expect(new Investment(label, balance, 5)).toBeTruthy();
        });
        it('Needs non-negative', () => {
            expect(() => new Investment(label, negativeNum, 0)).toThrowError();
        });
        it('Needs label', () => {
            expect(() => new Investment('', balance, 0)).toThrowError();
        });
    });
    describe('name', () => {
        it('matches', () => {
            const inv = new Investment(label, balance, 0);
            expect(inv.name()).toBe(label);
        });
    });
    describe('value', () => {
        it('same as cash at start', () => {
            const inv = new Investment(label, balance, 4);
            expect(inv.value()).toBe(inv.cash());
        });
        it('same as cash after several ticks', () => {
            const inv = new Investment(label, balance, 4);
            let i = 3;
            while(i-- > 0) inv.tick();
            expect(inv.value()).toBe(inv.cash());
        });
    });
    describe('deposit', () => {
        it('Accepts positive', () => {
            const inv = new Investment(label, balance, 7);
            inv.deposit(500);
        });
        it('Is reflected', () => {
            const inv = new Investment(label, balance, 7);
            const cashBefore = inv.cash();
            inv.deposit(500);
            expect(inv.cash()).toBe(cashBefore + 500);
        });
        it('Rejects negative', () => {
            const inv = new Investment(label, balance, 7);
            expect(() => inv.deposit(negativeNum)).toThrowError();
        });
    });
    describe('tick', () => {
        it('no gains this tick', () => {
            const inv = new Investment(label, balance, 5);
            inv.tick();
            expect(inv.gainsThisTick()).toBe(0);
        });
        it('value is reflected', () => {
            const inv = new Investment(label, balance, 5);
            inv.tick();
            const expected = balance * Math.pow(1.05, 1 / 12);
            closeEnough(inv.value(), expected, 2);
        });
        it('value is reflected after many ticks', () => {
            const inv = new Investment(label, balance, 5);
            inv.tick();
            inv.tick();
            inv.tick();
            const expected = balance * Math.pow(1.05, 3 / 12);
            closeEnough(inv.value(), expected, 2);
        });
    });
    describe('withdraw', () => {
        describe('balance', () => {
            it('Accepts less than balance', () => {
                const inv = new Investment(label, balance, 5);
                inv.withdraw(balance/2);
            });
            it('Is reflected', () => {
                const inv = new Investment(label, balance, 5);
                inv.withdraw(lessThanBalance);
                expect(inv.cash()).toBe(balance - lessThanBalance);
            });
            it('Rejects negative', () => {
                const inv = new Investment(label, balance, 5);
                expect(() => inv.withdraw(negativeNum)).toThrowError();
            });
            it('Rejects more than balance', () => {
                const inv = new Investment(label, balance, 5);
                expect(() => inv.withdraw(moreThanBalance)).toThrowError();
            });    
        });
        describe('gains', () => {
            it('Zero rate', () => {
                const inv = new Investment(label, balance, 0);
                inv.tick();
                inv.withdraw(lessThanBalance);
                // we took out half, but there were no gains
                expect(inv.gainsThisTick()).toBe(0);
            });
            it('Positive rate', () => {
                const inv = new Investment(label, balance, 10);
                inv.tick();
                const newBalance = inv.value();
                const grossGains = newBalance - balance;
                const partialGains = grossGains * (lessThanBalance / newBalance);
                inv.withdraw(lessThanBalance);
                closeEnough(inv.gainsThisTick(), partialGains, 2);
                expect(partialGains).toBeGreaterThan(0); // sanity check
            });
            it('Negative rate', () => {
                const inv = new Investment(label, balance, -10);
                inv.tick();
                const newBalance = inv.value();
                const grossGains = newBalance - balance;
                const partialGains = grossGains * (lessThanBalance / newBalance);
                inv.withdraw(lessThanBalance);
                closeEnough(inv.gainsThisTick(), partialGains, 2);
                expect(partialGains).toBeLessThan(0); // sanity check
            });
            it('Multiple withdrawals', () => {
                const inv = new Investment(label, balance, -10);
                inv.tick();
                const withdrawals = [1000, 2000, 3000];
                const totalOut = withdrawals.reduce((prev, next) => prev + next, 0);
                const newBalance = inv.value();
                const grossGains = newBalance - balance;
                const partialGains = grossGains * (totalOut / newBalance);
                withdrawals.forEach(dollars => inv.withdraw(dollars));
                closeEnough(inv.gainsThisTick(), partialGains, 2);
                expect(partialGains).toBeLessThan(0); // sanity check
            });    
        });
    });
    describe('needs', () => {
        it('always zero', () => {
            const inv = new Investment(label, balance, 5);
            expect(inv.needs()).toBe(0);
        });
    });
    describe('liquidate', () => {
        it('returns balance', () => {
            const inv = new Investment(label, balance, 5);
            const cash = inv.cash();
            expect(inv.liquidate()).toBe(cash);
        });
        it('zeros out balance', () => {
            const inv = new Investment(label, balance, 5);
            inv.liquidate();
            closeEnough(inv.liquidate(), 0, 2);
        });
        it('gains are none', () => {
            const inv = new Investment(label, balance, 5);
            inv.liquidate();
            expect(inv.gainsThisTick()).toBe(0);
        });
        it('gains are some', () => {
            const inv = new Investment(label, balance, 5, balance - 1000);
            inv.liquidate();
            closeEnough(inv.gainsThisTick(), 1000, 2);
        });
        it('gains are some after tick', () => {
            const inv = new Investment(label, balance, 5);
            inv.tick();
            const expected = balance * Math.pow(1.05, 1 / 12) - balance;
            inv.liquidate();
            closeEnough(inv.gainsThisTick(), expected, 2);
        });
    });
});
