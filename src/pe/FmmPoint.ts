import FmmLabel from "./FmmLabel";
import MeshPoint from "./MeshPoint";

export default class FmmPoint implements MeshPoint {
    public static readonly DEFAULT_TTR = Number.POSITIVE_INFINITY;
    public static readonly DEFAULT_LABEL = FmmLabel.FAR;

    public readonly i: number;
    public readonly j: number;
    public readonly x1: number;
    public readonly y1: number;
    public readonly x2: number;
    public readonly y2: number;
    public ttr: number = FmmPoint.DEFAULT_TTR;
    public label: FmmLabel = FmmPoint.DEFAULT_LABEL;

    private constructor(i: number, j: number, x1: number, y1: number, x2: number, y2: number) {
        this.i = i;
        this.j = j;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    public static create = (i: number, j: number, x1: number, y1: number, x2: number, y2: number) => {
        return new FmmPoint(i, j, x1, y1, x2, y2);
    }

    public static prefered = (a: FmmPoint, b: FmmPoint) => {
        return a.ttr < b.ttr;
    }

    public static equality = (a: FmmPoint, b: FmmPoint) => {
        return Object.is(a, b);
    }

    public consider = (ttr: number) => {
        this.label = FmmLabel.CONSIDERED;
        this.ttr = Math.min(this.ttr, ttr);
    }

    public accept = () => {
        this.label = FmmLabel.ACCEPTED;
    }

    public isAccepted = () => {
        return this.label === FmmLabel.ACCEPTED;
    }

    public reset = () => {
        this.ttr = FmmPoint.DEFAULT_TTR;
        this.label = FmmPoint.DEFAULT_LABEL;
    }

    private _owner: any;

    public set owner(value: any) {
        this._owner = value;
    }

    public get owner() {
        return this._owner;
    }
}