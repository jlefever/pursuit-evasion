import MeshPoint from "./MeshPoint";

type ForEachCallback<T extends MeshPoint> = (point: T) => void;

type DefaultFn<T extends MeshPoint> = (i: number, j: number, x1: number, y1: number, x2: number, y2: number) => T;

export default class Mesh<T extends MeshPoint> {
    private readonly _arr: T[][] = new Array<Array<T>>();
    private readonly _xStep: number;
    private readonly _yStep: number;
    private readonly _createPoint: DefaultFn<T>;

    constructor(xStep: number, yStep: number, createPoint: DefaultFn<T>) {
        this._xStep = xStep;
        this._yStep = yStep;
        this._createPoint = createPoint;
    }

    public get xStep() {
        return this._xStep;
    }

    public get yStep() {
        return this._yStep;
    }

    public access = (i: number, j: number): T => {
        if (!(i in this._arr)) {
            const inner = new Array<T>();
            this._arr[i] = inner;
            const point = this.createPoint(i, j);
            inner[j] = point;
            return point;
        }

        const inner = this._arr[i];

        if (!(j in inner)) {
            const point = this.createPoint(i, j);
            inner[j] = point;
            return point;
        }

        return inner[j];
    }

    public getI = (x: number) => Mesh.indexFor(this._xStep, x);

    public getJ = (y: number) => Mesh.indexFor(this._yStep, y);

    public getX = (i: number) => this._xStep * i;

    public getY = (j: number) => this._yStep * j;

    public forEach = (callback: ForEachCallback<T>) => {
        this._arr.forEach(arr => arr.forEach(p => callback(p)));
    }

    public reset = () => this.forEach((p => p.reset()));

    private static indexFor = (step: number, z: number) => {
        const initial = (z / step) | 0;
        const offset = (z % step) / (0.5 * step) | 0
        return initial + offset;
    }

    private createPoint(i: number, j: number) {
        const x1 = this.getX(i);
        const y1 = this.getY(j);
        const x2 = x1 + this._xStep;
        const y2 = y1 + this._yStep;
        return this._createPoint(i, j, x1, y1, x2, y2);
    }
}