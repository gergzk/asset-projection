import IAsset from './IAsset';
import IIncomeStream from './IIncomeStream';
import NamedAsset from './NamedAsset';

// These are hardcoded for now. Probably good enough for our needs.
const _FICALIMIT = 118500;
const _FICARATE = 0.062;
const _MEDICARERATE = 0.029;
export default class Income extends NamedAsset {
    private readonly m_deposit: IAsset;
    private readonly m_taxRate: number;
    private readonly m_streams: IIncomeStream[];
    private m_yearToDate: number;
    private m_preTaxDeposits: IAsset[];
    private m_postTaxDeposits: IAsset[];
    // Income should take money streams. These can encapsulate regular, bonus, unmarked plastic bags, etc
    constructor(label: string, streams: IIncomeStream[], depositAccount: IAsset, taxRate: number, linkedPostTaxAccounts: IAsset[], linkedPreTaxAccounts: IAsset[], tickAtStart?: number) {
        super(label, tickAtStart);
        if (!depositAccount) { throw new Error('Income has to deposit somewhere.'); }
        this.m_streams = streams;
        this.m_deposit = depositAccount;
        this.m_yearToDate = 0;
        this.m_taxRate = taxRate / 100;
        this.m_preTaxDeposits = linkedPreTaxAccounts;
        this.m_postTaxDeposits = linkedPostTaxAccounts;
    }
    tick(): void {
        // if this was the end of the year, roll everything over
        if (this.m_tick === 0) {
            this.m_yearToDate = 0;
        }

        // collect all my streams' incomes
        let monthGross = this.m_streams.map(stream => stream.grossMonthly()).reduce((prev, next) => prev + next, 0);
        // check if this happens before or after the 401k contributions
        // pay the medicare and fica
        let reductions = monthGross * this.medicareRate();
        const ficaEligible = Math.max(0, Math.min(this.ficaLimit(), this.m_yearToDate + monthGross) - this.m_yearToDate);
        reductions += (ficaEligible * this.ficaRate());
        // and now that we've processed fica, update the this.m_yearToDate
        this.m_yearToDate += monthGross;
        // remove money into pretax accounts. Need to reduce the tax-obligated monthly by this amount.
        this.m_preTaxDeposits.forEach(account => {
            const needs = account.needs();
            monthGross -= needs;
            account.deposit(needs);
            if (monthGross < 0) { throw new Error('Ran out of pre-tax money!!'); }
        });

        // and compute the personal tax rate on the post-tax amount
        reductions += (monthGross * this.m_taxRate);

        // and then dole out any post-tax money from the remainder
        this.m_postTaxDeposits.forEach(account => {
            const needs = account.needs();
            reductions += needs;
            account.deposit(needs);
        });
        // and put the remiander into the linked cash account
        const cash = monthGross - reductions;
        if (cash < 0) { throw new Error('Ran out of post-tax money!'); }
        this.m_deposit.deposit(cash);

        // and forward everything to next month
        super.tick();
        this.m_streams.forEach(stream => stream.tick());
    }
    private medicareRate() { return _MEDICARERATE; }
    private ficaRate() { return _FICARATE; }
    private ficaLimit() { return _FICALIMIT; }
}
