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
    const height = 595;
    const l = new Line(Vec2.car(0, 0), Vec2.car(0, height));
    const t = new Line(Vec2.car(0, 0), Vec2.car(width, 0));
    const r = new Line(Vec2.car(width, 0), Vec2.car(0, height));
    const b = new Line(Vec2.car(0, height), Vec2.car(width, 0));

    const arr = [l, t, r, b];
    const lengths = arr.map(x => x.rayLength(pos, angle));
    const a = lengths.filter(x => x != null && x >= 0);
    return pos.add(Vec2.pol(angle, Math.min(...(a as number[]))));
}

// function getWallIntersection(pos: Vec2, angle: number): Vec2 {
//     const width = 962;
//     const height = 595;

//     const d = Vec2.pol(angle, 1);

//     let tL, tR, tT, tB = 0;

//     if (d.x == 0) {
//         tL = -1;
//         tR = -1;
//     }
//     else {
//         tL = (0 - pos.x) / d.x;
//         tR = (width - pos.x) / d.x;
//     }

//     if (d.y == 0) {
//         tT = -1;
//         tB = -1;
//     }
//     else {
//         tT = (0 - pos.y) / d.y;
//         tB = (height - pos.y) / d.y;
//     }

//     const t = Math.min(...[tL, tR, tT, tB].filter(x => x >= 0));

//     return pos.add(Vec2.pol(angle, t));
// }

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
            this.target = Vec2.car(random() * 962, random() * 595);
        }

        return this.pos.lookAt(this.target).angle;
    }

    getStyle() {
        return {
            fill: { fillStyle: "#E0A06E" },
            stroke: { strokeStyle: "#BD875D", lineWidth: 3 }
        };
    }
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

class Board implements Drawable, Updatable {
    public readonly agents: Agent[];
    public readonly width: number;
    public readonly height: number;
    public readonly grid: Grid;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.grid = new Grid(Vec2.car(26, 16), width, height);
        // this.grid.setTerrian(6, 6);
        // this.grid.setTerrian(6, 7);

        this.agents = [];

        const eva = new CAgent(Vec2.car(250, 250), Vec2.pol(0, 2));
        const per = new PAgent(Vec2.car(700, 400), Vec2.pol(0, 1.4));
        const per2 = new PAgent(Vec2.car(500, 400), Vec2.pol(0, 1.4));
        const per3 = new PAgent(Vec2.car(200, 400), Vec2.pol(0, 1.4));
        const dummy = new RAgent(Vec2.car(140, 140), Vec2.pol(0, 2));
        const dummy2 = new LAgent(Vec2.car(140, 140), Vec2.pol(0.5 * PI, 1));

        per.setTarget(dummy);
        per2.setTarget(dummy);
        per3.setTarget(dummy);
        // eva.setTarget(per);

        this.agents.push(eva);
        this.agents.push(per);
        this.agents.push(per2);
        this.agents.push(per3);
        this.agents.push(dummy);
    }

    update = () => {
        this.agents.forEach(a => a.update());
    }

    draw = (ctx: Context) => {
        // ctx.save();
        // ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.width, this.height);
        // ctx.restore();

        // draw grid
        draw(ctx, this.grid.lines(), undefined, { strokeStyle: "#BDBDBD", lineWidth: 0.75 })
        draw(ctx, this.grid.terrian(), { fillStyle: "#808080" }, undefined);

        // draw agents
        this.agents.forEach(a => {
            const style = a.getStyle();
            draw(ctx, circle(a.pos, 15), style.fill, style.stroke);
            drawArrow(ctx, a.pos, a.vel.angle, 28, 8);

            const intersection = getWallIntersection(a.pos, a.vel.angle);
            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            drawLine(ctx, a.pos, intersection);
            ctx.fillStyle = "red";
            ctx.fill(circle(intersection, 3));
            ctx.restore();
        });
    }
}

export { Agent, Board };
