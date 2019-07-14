import NamedAsset from './NamedAsset';
import IIncomeStream from './IIncomeStream';


export default class AnnualBonus extends NamedAsset implements IIncomeStream {
    private m_gross: number;
    constructor(label: string, gross: number, ticksAtStart?: number) {
        super(label, ticksAtStart);
        this.m_gross = gross;
    }
    tick(): void {
        super.tick();
    }
    grossMonthly(): number {
        return this.m_tick === 0 ? this.m_gross : 0;
    }
}
