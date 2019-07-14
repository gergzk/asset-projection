import IAsset from './IAsset';
import IIncomeStream from './IIncomeStream';
import BaseAsset from './BaseAsset';


export default class PercentagePull extends BaseAsset implements IAsset {
    // adapter to pull a pecentage of argument income accounts' grossMonthlies
    private readonly m_destination: IAsset;
    private readonly m_percent: number;
    private readonly m_yearLimit: number;
    private readonly m_incomes: IIncomeStream[];
    private m_yearTotal: number;
    constructor(incomes: IIncomeStream[], destinationAccount: IAsset, percent: number, yearLimit: number, tickAtStart?: number) {
        if (!destinationAccount) { throw new Error('Need an account to push money to.'); }
        super('Transfer to ' + destinationAccount.name(), tickAtStart);
        this.m_destination = destinationAccount;
        this.m_percent = percent / 100;
        this.m_yearLimit = yearLimit || Number.MAX_VALUE;
        this.m_incomes = incomes;
        this.m_yearTotal = 0;
    }
    deposit(dollars: number): void {
        if (this.m_yearTotal + dollars > this.m_yearLimit) { throw new Error('Trying to put too much money in.'); }
        this.m_yearTotal += dollars;
        this.m_destination.deposit(dollars);
    }
    needs(): number {
        const available = this.m_incomes.map(income => income.grossMonthly()).reduce((prev, next) => prev + next, 0);
        let pull = available * this.m_percent;
        if (this.m_yearLimit !== Number.MAX_VALUE) {
            pull = Math.max(0, Math.min(this.m_yearLimit - this.m_yearTotal, pull));
        }
        return pull;
    }
    tick(): void {
        super.tick();
        if (this.m_tick === 0) {
            this.m_yearTotal = 0;
        }
    }
    cash(): number { return 0; }
    liquidate(): number { throw new Error('Can not liquidate a pull.'); }
    value(): number { return 0; }
    withdraw(dollars: number): void { throw new Error('Can not withdraw from a pull.'); }
}
