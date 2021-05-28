import FreqTimer from "./FreqTimer";

type UpdateFn = () => void;
type RenderFn = (alpha: number) => void;

export default class GameLoop {
    private readonly _update: UpdateFn;
    private readonly _render: RenderFn;
    private _updateTimer: FreqTimer = new FreqTimer();
    private _renderTimer: FreqTimer = new FreqTimer();
    private _lastFrameId: number = 0;
    private _targetUpdatesPerSecond: number = 0;
    private _targetMsPerUpdate: number = 0;
    private _isPlaying: boolean = false;
    private _previous: number = 0;
    private _lag: number = 0;

    public constructor(update: UpdateFn, render: RenderFn, targetUPS: number) {
        this._update = update;
        this._render = render;
        this.targetUps = targetUPS;
    }

    public get targetUps() {
        return this._targetUpdatesPerSecond;
    }

    public set targetUps(value: number) {
        this._targetUpdatesPerSecond = value;
        this._targetMsPerUpdate = 1000 / value;
    }

    public get framesPerSecond() {
        return this._renderTimer.hertz();
    }

    public get updatesPerSecond() {
        return this._updateTimer.hertz();
    }

    public get isPlaying() {
        return this._isPlaying;
    }

    public set playing(value: boolean) {
        if (value) {
            this.play();
        } else {
            this.pause();
        }
    }

    public play = () => {
        if (this._isPlaying) return;
        this._isPlaying = true;
        this._previous = performance.now();
        this.loop();
    }

    public pause = () => {
        if (!this._isPlaying) return;
        this._isPlaying = false;
        window.cancelAnimationFrame(this._lastFrameId);
    }

    private loop = () => {
        const current = performance.now();
        const elapsed = current - this._previous;
        this._previous = current;
        this._lag += elapsed;

        while (this._lag >= this._targetMsPerUpdate) {
            this._updateTimer.tick();
            this._update();
            this._lag -= this._targetMsPerUpdate;
        }

        this._renderTimer.tick();
        this._render(this._lag / this._targetMsPerUpdate);
        this._lastFrameId = window.requestAnimationFrame(this.loop);
    }
}