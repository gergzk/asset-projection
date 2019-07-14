import Salary from './Salary';
import { closeEnough } from '../mocks/Utilities';

describe('Salary', () => {
    const label = 'Base pay';
    const gross = 4000;
    const rate = 3;
    describe('constructor', () => {
        it('constructs', () => {
            expect(new Salary(label, gross, rate)).toBeTruthy();
        });
        it('must be positive', () => {
            expect(() => new Salary(label, -1000, 0)).toThrowError();
        });
    });
    describe('grossMonthly', () => {
        it('returns input value', () => {
            const s = new Salary(label, gross, 0);
            expect(s.grossMonthly()).toBe(gross);
        });
    });
    describe('tick', () => {
        it('does not apply raise in first month', () => {
            const s = new Salary(label, gross, rate);
            s.tick();
            expect(s.grossMonthly()).toBe(gross);
        });
        it('does not apply raise in 11th month', () => {
            const s = new Salary(label, gross, rate);
            for (let i = 0; i < 11; i++) {
                s.tick();
            }
            expect(s.grossMonthly()).toBe(gross);
        });
        it('applies raise in 12th month', () => {
            const s = new Salary(label, gross, rate);
            for (let i = 0; i < 12; i++) {
                s.tick();
            }
            const expected = gross * (1 + rate / 100);
            closeEnough(s.grossMonthly(), expected, 2);
        });
        it('applies raise in 8th month due to offset', () => {
            const s = new Salary(label, gross, rate, 4);
            for (let i = 0; i < 8; i++) {
                s.tick();
            }
            const expected = gross * (1 + rate / 100);
            closeEnough(s.grossMonthly(), expected, 2);
        });
    });
});
