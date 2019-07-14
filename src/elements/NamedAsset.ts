export default class NamedAsset {
    private readonly m_label: string;
    m_tick: number;
    constructor(label: string, tickAtStart?: number) {
        if (!label) { throw new Error('Need a label.'); }
        this.m_label = label;
        this.m_tick = Math.floor(tickAtStart || 0) % 12;
    }
    name(): string { return this.m_label; }
    tick(): void { this.m_tick = (this.m_tick + 1) % 12; }
}
