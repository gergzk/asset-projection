import NamedAsset from './NamedAsset';

describe('NamedAsset', () => {
    const label = 'Some asset';
    describe('constructor', () => {
        it('constructs', () => {
            expect(new NamedAsset(label)).toBeTruthy();
        });
        it('fails empty name', () => {
            expect(() => new NamedAsset('')).toThrowError();
        });
        it('constructs with optional tick', () => {
            expect(new NamedAsset(label, 4)).toBeTruthy();
        });
    });
    describe('name', () => {
        it('is what it is', () => {
            const n = new NamedAsset(label);
            expect(n.name()).toBe(label);
        });
    });
    describe('tick', () => {
        it('defaults to zero', () => {
            const n = new NamedAsset(label);
            expect(n.m_tick).toBe(0);
        });
        it('is what it is', () => {
            const n = new NamedAsset(label, 4);
            expect(n.m_tick).toBe(4);
        });
        it('handles fractions', () => {
            const n = new NamedAsset(label, 6.52);
            expect(n.m_tick).toBe(6);
        });
        it('ticks forward', () => {
            const n = new NamedAsset(label, 3);
            n.tick();
            n.tick();
            expect(n.m_tick).toBe(5);
        });
        it('wraps at 12', () => {
            const n = new NamedAsset(label, 10);
            n.tick();
            expect(n.m_tick).toBe(11);
            n.tick();
            expect(n.m_tick).toBe(0);
        });
    });
});
