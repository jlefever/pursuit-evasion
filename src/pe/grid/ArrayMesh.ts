import ArrayGrid from "./ArrayGrid";
import IMesh from "./IMesh";
import IMeshPoint from "./IMeshPoint";
import ISquare from "../geometry/ISquare";

type DefaultFn<T extends IMeshPoint> = (i: number, j: number, bounds: ISquare) => T;

export default class ArrayMesh<T extends IMeshPoint> extends ArrayGrid<T> implements IMesh<T> {
    private readonly _stepSize: number;

    constructor(createPoint: DefaultFn<T>, stepSize: number) {
        super((i: number, j: number) => createPoint(i, j, ArrayMesh.boundsFor(stepSize, i, j)));
        this._stepSize = stepSize;
    }

    public get stepSize() {
        return this._stepSize;
    }

    public getI = (x: number) => x / this.stepSize | 0;

    public getJ = (y: number) => y / this.stepSize | 0;

    public getX = (i: number) => this.stepSize * i;

    public getY = (j: number) => this.stepSize * j;

    public getBounds = (i: number, j: number) => ArrayMesh.boundsFor(this.stepSize, i, j);

    private static boundsFor = (stepSize: number, i: number, j: number) => {
        const x = stepSize * i;
        const y = stepSize * j;
        return { origin: { x, y }, size: stepSize };
    }
}