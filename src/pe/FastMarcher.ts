import Environment from "./Environment";
import FmmPoint from "./FmmPoint";
import Mesh from "./Mesh";
import Queue from "./Queue";

const {abs, min, pow, sqrt} = Math;
const sq = (z: number) => pow(z, 2);

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
        const init = this._mesh.access(this._mesh.getI(x0), this._mesh.getJ(y0));
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

    private ttr = (p: FmmPoint, speed: number) => {
        const get = (i: number, j: number) => this._mesh.access(i, j).ttr;
        const uH = min(get(p.i - 1, p.j), get(p.i + 1, p.j));
        const uV = min(get(p.i, p.j - 1), get(p.i, p.j + 1));
        const time = this._stepSize / speed;

        // Lower-dimensional update
        if (abs(uH - uV) > time) return min(uH, uV) + time;

        // Full update
        const underRad = sq(uH + uV) - 2 * (sq(uH) + sq(uV) - sq(time));
        return 0.5 * (uH + uV + sqrt(underRad));
    }

    private isInBounds = (i: number, j: number) => {
        const maxI = this._mesh.getI(this._env.width);
        const maxJ = this._mesh.getJ(this._env.height);
        return i >= 0 && j >= 0 && i <= maxI && j <= maxJ;
    }

    private getReachableNeighbors = (p: FmmPoint) => {
        const arr = new Array<FmmPoint>();
        if (this.isInBounds(p.i - 1, p.j)) arr.push(this._mesh.access(p.i - 1, p.j));
        if (this.isInBounds(p.i + 1, p.j)) arr.push(this._mesh.access(p.i + 1, p.j));
        if (this.isInBounds(p.i, p.j - 1)) arr.push(this._mesh.access(p.i, p.j - 1));
        if (this.isInBounds(p.i, p.j + 1)) arr.push(this._mesh.access(p.i, p.j + 1));
        return arr;
    }
}