import FastMarcher from "./FastMarcher";
import FmmPoint from "./FmmPoint";
import Mesh from "./Mesh";
import Queue from "./Queue";

const { acos, atan2, cos, PI, random, sin, sqrt } = Math;

class Vec2 {
    private readonly _x: number;
    private readonly _y: number;

    private constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get angle() {
        return atan2(this.y, this.x);
    }

    get length() {
        return sqrt(this.dot(this));
    }

    static car(x: number, y: number) {
        return new Vec2(x, y);
    }

    static pol(angle: number, length: number) {
        return Vec2.car(cos(angle), sin(angle)).scale(length);
    }

    static add(...vecs: Vec2[]) {
        const x = vecs.reduce((acc, cur) => acc + cur.x, 0);
        const y = vecs.reduce((acc, cur) => acc + cur.y, 0);
        return Vec2.car(x, y);
    }

    static sub(head: Vec2, ...tail: Vec2[]) {
        const x = tail.reduce((acc, cur) => acc - cur.x, head.x);
        const y = tail.reduce((acc, cur) => acc - cur.y, head.y);
        return Vec2.car(x, y);
    }

    static dot(...vecs: Vec2[]) {
        const x = vecs.reduce((acc, cur) => acc * cur.x, 1);
        const y = vecs.reduce((acc, cur) => acc * cur.y, 1);
        return x + y;
    }

    between(other: Vec2) {
        return acos(Vec2.dot(this, other) / this.length * other.length);
    }

    add = (...vecs: Vec2[]) => Vec2.add(this, ...vecs);

    sub = (...vecs: Vec2[]) => Vec2.sub(this, ...vecs);

    dot = (...vecs: Vec2[]) => Vec2.dot(this, ...vecs);

    cross = (vec: Vec2) => this.x * vec.y - (this.y * vec.x);

    rotate = (angle: number) => Vec2.pol(addRadians(this.angle, angle), this.length);

    rotateTo = (angle: number) => Vec2.pol(angle, this.length);

    scale = (c: number) => Vec2.car(c * this.x, c * this.y);

    scaleTo = (length: number) => Vec2.pol(this.angle, length);

    lookAt = (pos: Vec2) => Vec2.pol(pos.sub(this).angle, this.length);

    dist = (pos: Vec2) => this.sub(pos).length;
}

type Context = CanvasRenderingContext2D;

interface Updatable {
    update(): void;
}

interface Drawable {
    draw(ctx: Context): void;
}

interface Fill {
    readonly fillStyle: string;
}

interface Stroke {
    readonly strokeStyle: string;
    readonly lineWidth: number;
}

function addRadians(...rads: number[]) {
    return rads.reduce((a, b) => a + b, 0) % (2 * PI);
}

function circle(pos: Vec2, radius: number): Path2D {
    const path = new Path2D();
    path.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * PI);
    return path;
}

function arrow(pos: Vec2, sideLength: number): Path2D {
    const path = new Path2D();
    path.moveTo(pos.x, pos.y);
    path.lineTo(sideLength, 0);
    path.lineTo(sideLength, sideLength);
    return path;
}

// function grid(size: Vec2, width: number, height: number): Path2D {
//     const cellW = width / size.x;
//     const cellH = height / size.y;

//     const root = new Path2D();

//     for (let i = 0; i <= size.x; i++) {
//         const x = i * cellW;
//         const line = new Path2D();
//         line.moveTo(x, 0);
//         line.lineTo(x, height);
//         root.addPath(line);
//     }

//     for (let i = 0; i <= size.y; i++) {
//         const y = i * cellH;
//         const line = new Path2D();
//         line.moveTo(0, y);
//         line.lineTo(width, y);
//         root.addPath(line);
//     }

//     return root;
// }

function draw(ctx: Context, path: Path2D, fill?: Fill, stroke?: Stroke) {
    if (fill || stroke) {
        ctx.beginPath();
    }

    if (fill) {
        ctx.fillStyle = fill.fillStyle;
        ctx.fill(path);
    }

    if (stroke) {
        ctx.strokeStyle = stroke.strokeStyle;
        ctx.lineWidth = stroke.lineWidth;
        ctx.stroke(path);
    }
}

function drawArrow(ctx: Context, pos: Vec2, dir: number, radius: number, sideLength: number) {
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.translate(pos.x, pos.y);
    ctx.rotate(dir);
    ctx.translate(radius, 0);
    ctx.rotate(PI / 4);
    ctx.moveTo(-sideLength, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, sideLength);
    ctx.stroke();
    ctx.restore();
}

function drawLine(ctx: Context, a: Vec2, b: Vec2) {
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}

interface Vehicle {
    pos: Vec2;
    vel: Vec2;
}

interface Steerer {
    getDesiredDirection(me: Vehicle, target: Vehicle): number;
}

class Seek implements Steerer {
    getDesiredDirection(me: Vehicle, target: Vehicle): number {
        return me.pos.lookAt(target.pos).angle;
    }
}

class Persuit implements Steerer {
    getDesiredDirection(me: Vehicle, target: Vehicle): number {
        const c = 0.1;
        const t = me.pos.dist(target.pos) * c;
        return me.pos.lookAt(target.pos.add(target.vel.scale(t))).angle;
    }
}

class Flee implements Steerer {
    getDesiredDirection(me: Vehicle, target: Vehicle): number {
        return target.vel.angle;
    }
}

class Evasion implements Steerer {
    getDesiredDirection(me: Vehicle, target: Vehicle): number {
        const c = 0.1;
        const t = me.pos.dist(target.pos) * c;
        return me.pos.lookAt(target.pos.add(target.vel.scale(t))).rotate(PI).angle;
    }
}

class Line {
    origin: Vec2; // q
    offset: Vec2; // s

    constructor(origin: Vec2, offset: Vec2) {
        this.origin = origin;
        this.offset = offset;
    }

    rayLength(pos: Vec2, angle: number): number | null {
        // https://stackoverflow.com/a/565282
        const r = Vec2.pol(angle, 1);
        const rxs = r.cross(this.offset);
        if (rxs == 0) return null;
        return this.origin.sub(pos).cross(this.offset.scale(1 / rxs));
    }

    avoid(pos: Vec2, angle: number): number {
        const theta1 = pos.lookAt(this.origin).angle;
        const theta2 = pos.lookAt(this.origin.add(this.offset)).angle;
        const dist1 = Vec2.pol(theta1, 1).dist(Vec2.pol(angle, 1));
        const dist2 = Vec2.pol(theta2, 1).dist(Vec2.pol(angle, 1));
        if (dist1 < dist2) return theta1;
        return theta2;
    }
}

function getWallIntersection(pos: Vec2, angle: number) {
    const width = 962;
    const height = 592;
    const l = new Line(Vec2.car(0, 0), Vec2.car(0, height));
    const t = new Line(Vec2.car(0, 0), Vec2.car(width, 0));
    const r = new Line(Vec2.car(width, 0), Vec2.car(0, height));
    const b = new Line(Vec2.car(0, height), Vec2.car(width, 0));

    const arr = [l, t, r, b];
    const lengths = arr.map(x => x.rayLength(pos, angle));
    const a = lengths.filter(x => x != null && x >= 0);
    return pos.add(Vec2.pol(angle, Math.min(...(a as number[]))));
}

interface AgentStyle {
    fill: Fill;
    stroke: Stroke;
}

// abstract class Agent implements Updatable {
//     vehicle: Vehicle;
//     steerer: Steerer;

//     constructor(vehicle: Vehicle, steerer: Steerer) {
//         this.vehicle = vehicle;
//         this.steerer = steerer;
//     }
// }

abstract class Agent implements Updatable {
    pos: Vec2;
    vel: Vec2;

    constructor(pos: Vec2, vel: Vec2) {
        this.pos = pos;
        this.vel = vel;
    }

    update() {
        this.vel = this.vel.rotateTo(this.getDirection());

        // const intersection = getWallIntersection(this.pos, this.vel.angle);
        // const weight = 1 / this.pos.dist(intersection);
        // const angle = this.vel.add(Vec2.pol(PI, weight)).angle;
        // this.vel = this.vel.rotate(angle);

        this.pos = this.pos.add(this.vel);
    }

    abstract getDirection(): number;
    abstract getStyle(): AgentStyle;
}

class CAgent extends Agent {
    getDirection() {
        return this.vel.rotate(0.01 * PI).angle;
    }

    getStyle() {
        return {
            fill: { fillStyle: "#7EE0B1" },
            stroke: { strokeStyle: "#68BA93", lineWidth: 3 }
        };
    }
}

class LAgent extends Agent {
    getDirection() {
        return this.vel.angle;
    }

    getStyle() {
        return {
            fill: { fillStyle: "#7EE0B1" },
            stroke: { strokeStyle: "#68BA93", lineWidth: 3 }
        };
    }
}

class PAgent extends Agent {
    target: Agent | undefined;

    setTarget(target: Agent) {
        this.target = target;
    }

    getDirection() {
        return new Persuit().getDesiredDirection(this, this.target!);
    }

    getStyle() {
        return {
            fill: { fillStyle: "#79BEE0" },
            stroke: { strokeStyle: "#67A1BD", lineWidth: 3 }
        };
    }
}

class RAgent extends Agent {
    target?: Vec2;

    getDirection() {
        if (!this.target || this.pos.dist(this.target) < 10) {
            this.target = Vec2.car(random() * 962, random() * 592);
        }

        return this.pos.lookAt(this.target).angle;
    }

    getStyle() {
        return {
            fill: { fillStyle: "#79BEE0" },
            stroke: { strokeStyle: "#67A1BD", lineWidth: 3 }
        };
    }

    // getStyle() {
    //     return {
    //         fill: { fillStyle: "#E0A06E" },
    //         stroke: { strokeStyle: "#BD875D", lineWidth: 3 }
    //     };
    // }
}

class EAgent extends Agent {
    target?: Agent;

    setTarget(target: Agent) {
        this.target = target;
    }

    getDirection() {
        return new Evasion().getDesiredDirection(this, this.target!);
    }

    getStyle() {
        return {
            fill: { fillStyle: "#E0A06E" },
            stroke: { strokeStyle: "#BD875D", lineWidth: 3 }
        };
    }
}

class Grid {
    size: Vec2;
    width: number;
    height: number;
    cellW: number;
    cellH: number;
    cells: boolean[][];

    constructor(size: Vec2, width: number, height: number) {
        this.size = size;
        this.width = width;
        this.height = height;
        this.cellW = width / size.x
        this.cellH = height / size.y
        this.cells = new Array(size.x).fill(0).map(() => new Array(size.y).fill(0));
    }

    setTerrian(i: number, j: number) {
        this.cells[i][j] = true;
    }

    terrian(): Path2D {
        const root = new Path2D();
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                if (!this.cells[i][j]) continue;
                const path = new Path2D();
                path.rect(i * this.cellW, j * this.cellH, this.cellW, this.cellH);
                root.addPath(path);
            }
        }
        return root;
    }

    lines(): Path2D {
        const root = new Path2D();

        for (let i = 0; i <= this.size.x; i++) {
            const x = i * this.cellW;
            const line = new Path2D();
            line.moveTo(x, 0);
            line.lineTo(x, this.height);
            root.addPath(line);
        }

        for (let i = 0; i <= this.size.y; i++) {
            const y = i * this.cellH;
            const line = new Path2D();
            line.moveTo(0, y);
            line.lineTo(this.width, y);
            root.addPath(line);
        }

        return root;
    }
}

function rgb(r: number, g: number, b: number) {
    return `rgb(${r},${g},${b})`;
}

function findMax(mesh: Mesh<FmmPoint>) {
    let max = Number.NEGATIVE_INFINITY;

    mesh.forEach(p => {
        if (p.ttr == Number.POSITIVE_INFINITY) return;
        if (p.ttr > max) max = p.ttr;
    });

    return max;
}

function drawMesh(ctx: Context, mesh: Mesh<FmmPoint>) {
    ctx.save();

    ctx.lineWidth = 0;
    ctx.globalAlpha = 0.5;

    const max = findMax(mesh);

    mesh.forEach(p => {
        const scale = ((p.ttr / max) * 255);
        // const scale = 127;

        if (p.owner == "B") {
            ctx.fillStyle = rgb(127, 127, 127);
        } else if (p.owner == "E") {
            ctx.fillStyle = rgb(0, 0, scale);
        } else if (p.owner == "P") {
            ctx.fillStyle = rgb(scale, 0, 0);
        }
        
        ctx.fillRect(p.x1 | 0, p.y1 | 0, (p.x2 - p.x1) + 1, (p.y2 - p.y1)  + 1);
    });

    ctx.restore();
}

function mergeMeshs(a: Mesh<FmmPoint>, b: Mesh<FmmPoint>) {
    a.forEach(p1 => {
        const p2 = b.access(p1.i, p1.j);


        if (Math.abs(p1.ttr - p2.ttr) < 0) {
            p1.owner = "B";
            p2.owner = "B";
        } else if (p1.ttr > p2.ttr) {
            p1.owner = "E";
            p2.owner = "E";
        } else {
            p1.owner = "P";
            p2.owner = "P";
        }
    });
}

// function drawMeshToImage(mesh: Mesh<FmmPoint>, image: ImageData) {
//     const getIndices = (x: number, y: number) => {
//         const red = y * (image.width * 4) + x * 4;
//         return [red, red + 1, red + 2, red + 3];
//       };

//     const max = findMax(mesh);

//     for (let x = 0; x < image.width; x++) {
//         for (let y = 0; y < image.height; y++) {
//             const ttr = mesh.getByXY(x, y).ttr;
//             const scale = 255 * (ttr / max);

//             const [red, green, blue, alpha] = getIndices(x, y);
//             image.data[red] = scale;
//             image.data[green] = scale;
//             image.data[blue] = scale;
//             image.data[alpha] = 255;
//         }
//     }
// }

function drawDebugDot(ctx: Context, x: number, y: number) {
    ctx.save();
    ctx.lineWidth = 0;
    ctx.fillStyle = "red";
    ctx.fill(circle(Vec2.car(x, y), 3));
    ctx.restore();
}

class Board implements Updatable {
    public readonly agents: Agent[];
    public readonly width: number;
    public readonly height: number;
    public readonly grid: Grid;
    private readonly _marcherE: FastMarcher;
    private readonly _marcherP: FastMarcher;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = new Grid(Vec2.car(26, 26), width, height);

        this.grid.setTerrian(10, 10);
        this.grid.setTerrian(10, 11);
        this.grid.setTerrian(10, 12);

        this._marcherE = new FastMarcher({ width: this.width, height: this.height }, 37);
        this._marcherP = new FastMarcher({ width: this.width, height: this.height }, 37);

        this.agents = [];
        // const eva = new CAgent(Vec2.car(250, 250), Vec2.pol(0, 2));
        // const per = new PAgent(Vec2.car(700, 400), Vec2.pol(0, 1.4));
        // const per2 = new PAgent(Vec2.car(500, 400), Vec2.pol(0, 1.4));
        // const per3 = new PAgent(Vec2.car(200, 400), Vec2.pol(0, 1.4));
        // const dummy = new RAgent(Vec2.car(140, 140), Vec2.pol(0, 2));
        // this.agents.push(dummy);

        const agent1 = new RAgent(Vec2.car(500, 400), Vec2.pol(0, 5));
        const agent2 = new RAgent(Vec2.car(100, 100), Vec2.pol(0, 5));
        this.agents.push(agent1);
        this.agents.push(agent2);
    }

    update = () => {
        this.agents.forEach(a => a.update());

        const posE = this.agents[0].pos;
        const speedE = this.agents[0].vel.length;
        this._marcherE.march(posE.x, posE.y, speedE);

        const posP = this.agents[1].pos;
        const speedP = this.agents[1].vel.length;
        this._marcherP.march(posP.x, posP.y, speedP);
        
        mergeMeshs(this._marcherE.mesh, this._marcherP.mesh);
    }

    draw = (ctx: Context, alpha: number) => {
        ctx.clearRect(0, 0, this.width, this.height);

        drawMesh(ctx, this._marcherE.mesh);

        let mesh = this._marcherE.mesh;
        let pos = this.agents[0].pos;
        let x = mesh.getX(mesh.getI(pos.x));
        let y = mesh.getY(mesh.getJ(pos.y));
        drawDebugDot(ctx, x, y);

        // ctx.putImageData(this._image, 0, 0);

        // draw grid
        draw(ctx, this.grid.lines(), undefined, { strokeStyle: "#BDBDBD", lineWidth: 0.75 })
        draw(ctx, this.grid.terrian(), { fillStyle: "#808080" }, undefined);

        // draw agents
        this.agents.forEach(a => {
            const style = a.getStyle();

            // const pos = a.pos.add(a.vel.scale(alpha));
            const pos = a.pos;
            draw(ctx, circle(pos, 15), style.fill, style.stroke);
            drawArrow(ctx, pos, a.vel.angle, 28, 8);

            // const intersection = getWallIntersection(pos, a.vel.angle);
            // ctx.save();
            // ctx.lineWidth = 1;
            // ctx.strokeStyle = "black";
            // drawLine(ctx, pos, intersection);
            // ctx.fillStyle = "red";
            // ctx.fill(circle(intersection, 3));
            // ctx.restore();
        });
    }
}

export { Agent, Board };
