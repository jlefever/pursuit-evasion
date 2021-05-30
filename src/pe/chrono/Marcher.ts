import ITerrian from "../terrian/ITerrian";
import MarchingPoint from "./MarchingPoint";
import ArrayMesh from "../grid/ArrayMesh";
import InsertionQueue from "../ads/InsertionQueue";
import IPoint from "../geometry/IPoint";
import IPriorityQueue from "../ads/IPriorityQueue";
import IMesh from "../grid/IMesh";

const {abs, min, pow, sqrt} = Math;
const sq = (z: number) => pow(z, 2);

export default class Marcher {
    private readonly _terrian: ITerrian;
    private readonly _mesh: IMesh<MarchingPoint>;
    private readonly _queue: IPriorityQueue<MarchingPoint>;

    constructor(terrian: ITerrian) {
        this._terrian = terrian;
        this._mesh = new ArrayMesh<MarchingPoint>(MarchingPoint.create, terrian.cellSize);
        this._queue = new InsertionQueue<MarchingPoint>(MarchingPoint.prefered, MarchingPoint.equality);
    }

    public get mesh() {
        return this._mesh;
    }

    public march = (start: IPoint, speed: number) => {
        this._mesh.reset();
        const init = this._mesh.getOrCreate(this._mesh.getI(start.x), this._mesh.getJ(start.y));
        init.consider(0);
        this._queue.push(init);

        while(!this._queue.isEmpty()) {
            const min = this._queue.pop()!;
            min.accept();
            this._queue.push(...this.step(min, speed));
        }
    }

    private step = (point: MarchingPoint, speed: number) => {
        const neighbors = this.getLegalNeighbors(point);
        const available = neighbors.filter(n => !n.isAccepted());
        available.forEach(p => p.consider(this.ttr(p, speed)));
        return available;
    }

    private ttr = (p: MarchingPoint, speed: number) => {
        const get = (i: number, j: number) => this._mesh.getOrCreate(i, j).ttr;
        const uH = min(get(p.i - 1, p.j), get(p.i + 1, p.j));
        const uV = min(get(p.i, p.j - 1), get(p.i, p.j + 1));
        const time = this._mesh.stepSize / speed;

        // Lower-dimensional update
        if (abs(uH - uV) > time) return min(uH, uV) + time;

        // Full update
        const underRad = sq(uH + uV) - 2 * (sq(uH) + sq(uV) - sq(time));
        return 0.5 * (uH + uV + sqrt(underRad));
    }

    private getLegalNeighbors = (p: MarchingPoint) => {
        const arr = new Array<MarchingPoint>();
        if (this._terrian.isLegalCell(p.i - 1, p.j)) arr.push(this._mesh.getOrCreate(p.i - 1, p.j));
        if (this._terrian.isLegalCell(p.i + 1, p.j)) arr.push(this._mesh.getOrCreate(p.i + 1, p.j));
        if (this._terrian.isLegalCell(p.i, p.j - 1)) arr.push(this._mesh.getOrCreate(p.i, p.j - 1));
        if (this._terrian.isLegalCell(p.i, p.j + 1)) arr.push(this._mesh.getOrCreate(p.i, p.j + 1));
        return arr;
    }
}