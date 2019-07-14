import IIncomeStream from './IIncomeStream';
import NamedAsset from './NamedAsset';

export default class Salary extends NamedAsset implements IIncomeStream {
    private m_gross: number;
    private m_growth: number;
    constructor(label: string, grossMonthly: number, growthRate: number, tickAtStart?: number) {
        super(label);
        if (grossMonthly <= 0) { throw new Error('Need a positive salary.'); }
        this.m_gross = grossMonthly;
        this.m_growth = 1 + (growthRate / 100);
        this.m_tick = Math.floor(tickAtStart || 0) % 12;
    }
    tick(): void {
        super.tick();
        if (this.m_tick === 0) {
            this.m_gross *= this.m_growth;
        }
    }
    grossMonthly(): number {
        return this.m_gross;
    }
}
