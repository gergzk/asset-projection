import BaseAsset from './BaseAsset';

export default class Investment extends BaseAsset {
    private m_balance: number;
    private m_rate: number;
    private m_basis: number;
    private m_gains: number;
    constructor(label: string, balance: number, annualGrowthPercent: number, basis?: number) {
        super(label);
        if (balance < 0) { throw new Error('Need a positive balance'); }
        this.m_balance = balance;
        this.m_rate = Math.pow(1 + (annualGrowthPercent / 100), 1 / 12);
        this.m_basis = basis || balance;
        this.m_gains = 0;
    }
    deposit(dollars: number): void {
        this.validateDeposit(dollars);
        this.m_balance += dollars; // assume no friction
        this.m_basis += dollars;
    }
    withdraw(dollars: number): void {
        this.validateWithdraw(dollars);
        // this locks the gains in, so we have to figure out how much the gains are!
        const balance = this.m_balance;
        const basis = this.m_basis;
        const grossGains = balance - basis;
        const fractionSold = dollars / balance;
        const gains = grossGains * fractionSold;
        this.m_basis *= (1 - fractionSold);
        this.m_gains += gains;
        this.m_balance -= dollars;
    }
    value(): number {
        return this.cash();
    }
    cash(): number {
        return this.m_balance;
    }
    needs(): number {
        return 0;
    }
    liquidate(): number {
        const balance = this.m_balance;
        this.withdraw(balance);
        return balance;
    }
    gainsThisTick(): number {
        return this.m_gains;
    }
    tick(): void {
        this.m_balance *= this.m_rate;
        this.m_gains = 0;
    }
}
