import BaseAsset from './BaseAsset';

export default class Cash extends BaseAsset {
    private m_balance: number;
    constructor(label: string, balance: number) {
        super(label);
        if (balance < 0) { throw new Error('Can not have a negative balance.'); }
        this.m_balance = balance;
    }
    value(): number { return this.cash(); }
    cash(): number { return this.m_balance; }
    deposit(dollars: number): void {
        this.validateDeposit(dollars);
        this.m_balance += dollars;
    }
    withdraw(dollars: number): void {
        this.validateWithdraw(dollars);
        this.m_balance -= dollars;
    }
    needs(): number { return 0; }
    liquidate(): number {
        const val = this.m_balance;
        this.m_balance = 0;
        return val;
    }
}
