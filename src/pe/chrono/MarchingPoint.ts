import MarchingLabel from "./MarchingLabel";
import ISquare from "../geometry/ISquare";
import IChronoPoint from "./IChronoPoint";

export default class MarchingPoint implements IChronoPoint {
    public static readonly DEFAULT_TTR = Number.POSITIVE_INFINITY;
    public static readonly DEFAULT_LABEL = MarchingLabel.FAR;

    public readonly i: number;
    public readonly j: number;
    public readonly bounds: ISquare;
    private _ttr: number = MarchingPoint.DEFAULT_TTR;
    private _label: MarchingLabel = MarchingPoint.DEFAULT_LABEL;

    private constructor(i: number, j: number, bounds: ISquare) {
        this.i = i;
        this.j = j;
        this.bounds = bounds;
    }

    public get ttr() {
        return this._ttr;
    }

    public get label() {
        return this._label;
    }

    public static create = (i: number, j: number, bounds: ISquare) => {
        return new MarchingPoint(i, j, bounds);
    }

    public static prefered = (a: MarchingPoint, b: MarchingPoint) => {
        return a.ttr < b.ttr;
    }

    public static equality = (a: MarchingPoint, b: MarchingPoint) => {
        return Object.is(a, b);
    }

    public consider = (ttr: number) => {
        this._label = MarchingLabel.CONSIDERED;
        this._ttr = Math.min(this.ttr, ttr);
    }

    public accept = () => {
        this._label = MarchingLabel.ACCEPTED;
    }

    public isAccepted = () => {
        return this.label === MarchingLabel.ACCEPTED;
    }

    public reset = () => {
        this._ttr = MarchingPoint.DEFAULT_TTR;
        this._label = MarchingPoint.DEFAULT_LABEL;
    }
}