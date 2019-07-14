import IAsset from './IAsset';
import NamedAsset from './NamedAsset';

export default abstract class BaseAsset extends NamedAsset implements IAsset {
    constructor(label: string, ticksAtStart?: number) {
        super(label, ticksAtStart);
    }
    validateDeposit(dollars: number): void {
        if (dollars < 0) { throw new Error('Can not deposit negative amount'); }
    }
    validateWithdraw(dollars: number): void {
        if (dollars < 0) { throw new Error('Can not withdraw negative amount'); }
        if (dollars > this.cash()) { throw new Error('Can not withdraw more than the cash available'); }
    }
    abstract deposit(dollars: number): void;
    abstract withdraw(dollars: number): void;
    abstract needs(): number;
    abstract value(): number;
    abstract cash(): number;
    abstract liquidate(): number;
}
