import Cash from './Cash';

describe('Cash', () => {
    const label = 'Cash on hand';
    const num1 = 10000;
    const num2 = 5000;
    const negativeNum = -1000;
    describe('Constructor', () => {
        it('Constructs', () => {
            expect(new Cash(label, num1)).toBeTruthy();
        });
        it('Needs non-negative', () => {
            expect(() => new Cash(label, negativeNum)).toThrowError();
        });
        it('Needs label', () => {
            expect(() => new Cash('', num1)).toThrowError();
        });
    });
    describe('name', () => {
        it('matches', () => {
            const c = new Cash(label, num1);
            expect(c.name()).toBe(label);
        });
    });
    describe('tick', () => {
        it('noop', () => {
            const c = new Cash(label, num1);
            c.tick();
            expect(c.cash()).toBe(num1);
        });
    });
    describe('value', () => {
        it('same as cash', () => {
            const c = new Cash(label, num1);
            expect(c.value()).toBe(c.cash());
        });
    });
    describe('deposit', () => {
        it('Accepts positive', () => {
            const c = new Cash(label, num1);
            c.deposit(num2);
        });
        it('Is reflected', () => {
            const c = new Cash(label, num1);
            c.deposit(num2);
            expect(c.cash()).toBe(num1 + num2);
        });
        it('Rejects negative', () => {
            const c = new Cash(label, num1);
            expect(() => c.deposit(negativeNum)).toThrowError();
        });
    });
    describe('withdraw', () => {
        it('Accepts less than balance', () => {
            const c = new Cash(label, num1);
            c.withdraw(num2);
        });
        it('Is reflected', () => {
            const c = new Cash(label, num1);
            c.withdraw(num2);
            expect(c.cash()).toBe(num1 - num2);
        });
        it('Rejects negative', () => {
            const c = new Cash(label, num1);
            expect(() => c.withdraw(negativeNum)).toThrowError();
        });
        it('Rejects more than balance', () => {
            const c = new Cash(label, num2);
            expect(() => c.withdraw(num1)).toThrowError();
        });
    });
    describe('needs', () => {
        it('always zero', () => {
            const c = new Cash(label, num1);
            expect(c.needs()).toBe(0);
        });
    });
    describe('liquidate', () => {
        it('returns balance', () => {
            const c = new Cash(label, num1);
            expect(c.liquidate()).toBe(num1);
        });
        it('zeros out balance', () => {
            const c = new Cash(label, num1);
            c.liquidate();
            expect(c.liquidate()).toBe(0);
        });
    });
});
