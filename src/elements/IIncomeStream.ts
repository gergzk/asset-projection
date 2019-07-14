export default interface IIncomeStream {
    // factor tick and name out?
    tick(): void;
    name(): string;
    grossMonthly(): number;
}
