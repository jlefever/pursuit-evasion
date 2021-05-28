export default class FreqTimer {
    private readonly _minIntervalLength: number;
    private _previous: number = 0;
    private _freq: number = 0;
    private _hertz: number = 0;
    
    public constructor(minIntervalLength: number = 500) {
        this._minIntervalLength = minIntervalLength;
    }

    public tick = () => {
        this._freq += 1;
        const now = performance.now()
        const elapsed = now - this._previous;
        if (elapsed < this._minIntervalLength) return;
        this._hertz = this._freq / (elapsed / 1000);
        this._freq = 0;
        this._previous = now;
    }

    public hertz = () => {
        return this._hertz;
    }
}