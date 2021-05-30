import FreqTimer from "./FreqTimer";
import IGameLoop from "./IGameLoop";

type UpdateFn = () => void;
type RenderFn = (alpha: number) => void;

export default class GameLoop implements IGameLoop {
    private readonly _update: UpdateFn;
    private readonly _render: RenderFn;
    private _updateTimer: FreqTimer = new FreqTimer();
    private _renderTimer: FreqTimer = new FreqTimer();
    private _lastFrameId: number = 0;
    private _targetTicksPerSecond: number = 0;
    private _targetMsPerTick: number = 0;
    private _isPlaying: boolean = false;
    private _previous: number = 0;
    private _lag: number = 0;

    public constructor(update: UpdateFn, render: RenderFn, targetTickRate: number) {
        this._update = update;
        this._render = render;
        this.targetTickRate = targetTickRate;
    }

    public get targetTickRate() {
        return this._targetTicksPerSecond;
    }

    public set targetTickRate(value: number) {
        this._targetTicksPerSecond = value;
        this._targetMsPerTick = 1000 / value;
    }

    public get frameRate() {
        return this._renderTimer.hertz();
    }

    public get tickRate() {
        return this._updateTimer.hertz();
    }

    public get isPlaying() {
        return this._isPlaying;
    }

    public set isPlaying(value: boolean) {
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

        while (this._lag >= this._targetMsPerTick) {
            this._updateTimer.tick();
            this._update();
            this._lag -= this._targetMsPerTick;
        }

        this._renderTimer.tick();
        this._render(this._lag / this._targetMsPerTick);
        this._lastFrameId = window.requestAnimationFrame(this.loop);
    }
}