import Environment from "./Environment";
import Mesh from "./Mesh";
import MeshPoint from "./MeshPoint";
import Queue from "./Queue";

enum NodeLabel {
    FAR = 0,
    CONSIDERED = 1,
    ACCEPTED = 2
}

class FmmPoint implements MeshPoint {
    public static readonly DEFAULT_TTR = Number.POSITIVE_INFINITY;
    public static readonly DEFAULT_LABEL = NodeLabel.FAR;

    public readonly i: number;
    public readonly j: number;
    public readonly x1: number;
    public readonly y1: number;
    public readonly x2: number;
    public readonly y2: number;
    public ttr: number = FmmPoint.DEFAULT_TTR;
    public label: NodeLabel = FmmPoint.DEFAULT_LABEL;

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
        this.label = NodeLabel.CONSIDERED;
        this.ttr = Math.min(this.ttr, ttr);
    }

    public accept = () => {
        this.label = NodeLabel.ACCEPTED;
    }

    public isAccepted = () => {
        return this.label === NodeLabel.ACCEPTED;
    }

    public reset = () => {
        this.ttr = FmmPoint.DEFAULT_TTR;
        this.label = FmmPoint.DEFAULT_LABEL;
    }
}

export default class FastMarcher {
    private readonly _env: Environment;
    private readonly _stepSize: number;
    private readonly _mesh: Mesh<FmmPoint>;
    private readonly _queue: Queue<FmmPoint>;

    constructor(env: Environment, stepSize: number) {
        this._env = env;
        this._stepSize = stepSize;
        this._mesh = new Mesh<FmmPoint>(stepSize, stepSize, FmmPoint.create);
        this._queue = new Queue<FmmPoint>(FmmPoint.prefered, FmmPoint.equality);
    }

    public get mesh() {
        return this._mesh;
    }

    public march = (x0: number, y0: number, speed: number) => {
        this._mesh.reset();
        const init = this._mesh.getByXY(x0, y0);
        init.consider(0);
        this._queue.push(init);

        while(!this._queue.isEmpty()) {
            const min = this._queue.pop()!;
            min.accept();
            this._queue.push(...this.update(min, speed));
        }
    }

    private update = (point: FmmPoint, speed: number) => {
        const neighbors = this.getReachableNeighbors(point);
        const available = neighbors.filter(n => !n.isAccepted());
        available.forEach(p => p.consider(this.ttr(p, speed)));
        return available;
    }

    private ttr = (point: FmmPoint, speed: number) => {
        const a = this._mesh.get(point.i - 1, point.j).ttr;
        const b = this._mesh.get(point.i + 1, point.j).ttr;
        const c = this._mesh.get(point.i, point.j - 1).ttr;
        const d = this._mesh.get(point.i, point.j + 1).ttr;
        const uH = Math.min(a, b);
        const uV = Math.min(c, d);
        const h = this._stepSize;
        const f = speed;
        const stepPerSpeed = h / f;

        // Lower-dimensional update
        const diff = Math.abs(uH - uV);
        if (diff >= stepPerSpeed) {
            return Math.min(uH, uV) + stepPerSpeed;
        }

        const sq = (z: number) => Math.pow(z, 2);

        const underRad = sq(uH + uV) - 2 * (sq(uH) + sq(uV) - sq(stepPerSpeed));
        return ((uH + uV) / 2) + 0.5 * Math.sqrt(underRad);
    }

    private isInBounds = (i: number, j: number) => {
        const maxI = this._mesh.getI(this._env.width);
        const maxJ = this._mesh.getI(this._env.height);
        return i >= 0 && j >= 0 && i <= maxI && j <= maxJ;
    }

    private getReachableNeighbors = (p: FmmPoint) => {
        const arr = new Array<FmmPoint>();
        if (this.isInBounds(p.i - 1, p.j)) arr.push(this._mesh.get(p.i - 1, p.j));
        if (this.isInBounds(p.i + 1, p.j)) arr.push(this._mesh.get(p.i + 1, p.j));
        if (this.isInBounds(p.i, p.j - 1)) arr.push(this._mesh.get(p.i, p.j - 1));
        if (this.isInBounds(p.i, p.j + 1)) arr.push(this._mesh.get(p.i, p.j + 1));
        return arr;
    }
}