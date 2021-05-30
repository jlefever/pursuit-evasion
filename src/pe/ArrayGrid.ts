import IGrid from "./IGrid";
import IGridPoint from "./IGridPoint";

export default class ArrayGrid<T extends IGridPoint> implements IGrid<T> {
    private readonly _arr: T[][] = new Array<Array<T>>();
    private readonly _createPoint: (i: number, j: number) => T;

    constructor(createPoint: (i: number, j: number) => T) {
        this._createPoint = createPoint;
    }

    public access = (i: number, j: number): T => {
        if (!(i in this._arr)) {
            const inner = new Array<T>();
            this._arr[i] = inner;
            const point = this._createPoint(i, j);
            inner[j] = point;
            return point;
        }

        const inner = this._arr[i];

        if (!(j in inner)) {
            const point = this._createPoint(i, j);
            inner[j] = point;
            return point;
        }

        return inner[j];
    }

    public forEach = (callback: (point: T) => void) => {
        this._arr.forEach(arr => arr.forEach(p => callback(p)));
    }

    public reset = () => this.forEach((p => p.reset && p.reset()));
}