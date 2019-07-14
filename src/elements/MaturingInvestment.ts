import Investment from './Investment';


export default class MaturingInvestment extends Investment {
    private m_ticksToMature: number;
    constructor(label: string, balance: number, growth: number, ticksToMature: number, basis?: number) {
        super(label, balance, growth, basis);
        this.m_ticksToMature = ticksToMature;
    }
    cash(): number {
        if (this.m_ticksToMature > 0) {
            return 0;
        }
        return super.cash();
    }
    tick(): void {
        super.tick();
        this.m_ticksToMature--;
    }
}
