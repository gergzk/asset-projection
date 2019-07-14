export default interface IAsset {
    name(): string; // dashboard identifier
    tick(): void; // every step is a month
    deposit(dollars: number): void;
    withdraw(dollars: number): void; // should this return something??
    needs(): number; // how many dollars I'm short
    value(): number; // paper value of asset
    cash(): number; // available dollars
    liquidate(): number; // produces cash
}
