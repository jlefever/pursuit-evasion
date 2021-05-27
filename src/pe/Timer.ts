export default class Timer {
    private readonly _history: number[];
    private readonly _maxHistoryLength: number;
    
    public constructor(maxHistoryLength: number = 100) {
        this._history = new Array();
        this._maxHistoryLength = maxHistoryLength;
    }

    public reset() {
        this._history.splice(0, this._history.length);
    }

    public tick() {
        this._history.push(performance.now() / 1000);

        if (this._history.length > this._maxHistoryLength) {
            this._history.shift();
        }
    }

    public hertz() {
        if (this._history.length < this._maxHistoryLength) {
            return 0;
        }

        const first = this._history[0];
        const last = this._history[this._maxHistoryLength - 1];
        return this._maxHistoryLength / (last - first);
    }
}