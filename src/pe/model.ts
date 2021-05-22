import { createContext } from "preact";

const { sin, cos, pow, atan2, sqrt, PI, acos, exp, abs } = Math;

const square = (x: number) => pow(x, 2);

type Pos = [number, number];

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
        return sqrt(square(this.x) + square(this.y));
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

    rotate = (angle: number) => Vec2.pol(addRad(this.angle, angle), this.length);

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

interface Path {
    toPath2D(): Path2D;
}

interface Fill {
    readonly fillStyle: string;
}

interface Stroke {
    readonly strokeStyle: string;
    readonly lineWidth: number;
}

class Circle implements Path {
    public readonly pos: Vec2;
    public readonly radius: number;
    private readonly _p: Path2D;

    constructor(pos: Vec2, radius: number) {
        this.pos = pos;
        this.radius = radius;
        this._p = new Path2D();
        this._p.ellipse(pos.x, pos.y, radius, radius, 0, 0, 2 * PI);
    }

    toPath2D() {
        return this._p;
    }
}

class Grid implements Path {
    public readonly pos: Pos;
    public readonly size: Pos;
    public readonly cellCount: Pos;

    constructor(pos: Pos, size: Pos, cellCount: Pos) {
        this.pos = pos;
        this.size = size;
        this.cellCount = cellCount;
    }

    toPath2D() {
        const root = new Path2D();

        const cellW = this.size[0] / this.cellCount[0];
        const cellH = this.size[1] / this.cellCount[1];

        for (let i = 0; i < this.size[0]; i++) {
            const x = i * cellW;
            const line = new Path2D();
            line.moveTo(x, 0);
            line.lineTo(x, this.size[1]);
            root.addPath(line);
        }

        for (let i = 0; i < this.size[1]; i++) {
            const y = i * cellH;
            const line = new Path2D();
            line.moveTo(0, y);
            line.lineTo(this.size[0], y);
            root.addPath(line);
        }

        return root;
    }
}

class Shape implements Drawable {
    readonly path: Path;
    readonly fill: Fill | undefined;
    readonly stroke: Stroke | undefined;

    constructor(path: Path, fill?: Fill, stroke?: Stroke) {
        this.path = path;
        this.fill = fill;
        this.stroke = stroke;
    }

    draw(ctx: Context) {
        ctx.beginPath();

        if (this.fill) {
            ctx.fillStyle = this.fill.fillStyle;
            ctx.fill(this.path.toPath2D());
        }

        if (this.stroke) {
            ctx.strokeStyle = this.stroke.strokeStyle;
            ctx.lineWidth = this.stroke.lineWidth;
            ctx.stroke(this.path.toPath2D());
        }
    }
}

abstract class Agent implements Updatable {
    pos: Vec2;
    vel: Vec2;

    constructor(pos: Vec2, vel: Vec2) {
        this.pos = pos;
        this.vel = vel;
    }

    update() {
        this.vel = this.vel.rotateTo(this.getDirection());
        this.pos = this.pos.add(this.vel);
    }

    abstract getDirection(): number;
    abstract getStroke(): Stroke;
    abstract getFill(): Fill;
}

const addRad = (...rads: number[]) => (rads.reduce((a, b) => a + b, 0)) % (2 * PI);

// 
const argFact = (compareFn: any) => (array: any) => array.map((el: any, idx: any) => [el, idx]).reduce(compareFn)[1]
const argMax = argFact((min: any, el: any) => (el[0] > min[0] ? el : min))
const argMin = argFact((max: any, el: any) => (el[0] < max[0] ? el : max))

class CAgent extends Agent {
    getDirection() {
        return this.vel.rotate(0.01 * PI).angle;
    }

    getStroke() {
        return { strokeStyle: "#68BA93", lineWidth: 3 };
    }

    getFill() {
        return { fillStyle: "#7EE0B1" };
    }
}

class LAgent extends Agent {
    getDirection() {
        return this.vel.angle;
    }

    getStroke() {
        return { strokeStyle: "#68BA93", lineWidth: 3 };
    }

    getFill() {
        return { fillStyle: "#7EE0B1" };
    }
}

class PAgent extends Agent {
    target: Agent | undefined;

    setTarget(target: Agent) {
        this.target = target;
    }

    getDirection() {
        // return this.target!.pos.sub(this.pos).angle;
        return this.pos.lookAt(this.target!.pos).angle;
    }

    getStroke() {
        return { strokeStyle: "#67A1BD", lineWidth: 3 };
    }

    getFill() {
        return { fillStyle: "#79BEE0" };
    }
}

function getClosestWallPos(me: Vec2) {
    const l = Vec2.car(0, me.y);
    const r = Vec2.car(962, me.y);
    const t = Vec2.car(me.x, 0);
    const b = Vec2.car(me.x, 595);

    const min = argMin([me.dist(l), me.dist(r), me.dist(t), me.dist(b)]);
    if (min == 0) return l;
    if (min == 1) return r;
    if (min == 2) return t;
    if (min == 3) return b;
    throw Error();
}

class EAgent extends Agent {
    target: Agent | undefined;

    setTarget(target: Agent) {
        this.target = target;
    }

    getDirection() {
        // const df = (-1 * exp(this.pos.x - 962)) + exp(0 - this.pos.x);
        // const dg = (-1 * exp(this.pos.y - 595)) + exp(0 - this.pos.y);
        // // const dg = exp(this.pos.y) - exp(595 - this.pos.y);
        // return Vec2.car(df, dg).angle;

        return this.pos.lookAt(getClosestWallPos(this.pos)).rotate(PI).angle;
    }

    getStroke() {
        return { strokeStyle: "#BD875D", lineWidth: 3 };
    }

    getFill() {
        return { fillStyle: "#E0A06E" };
    }
}

class Board implements Drawable, Updatable {
    public readonly agents: Agent[];
    public readonly width: number;
    public readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.agents = [];

        const eva = new EAgent(Vec2.car(250, 250), Vec2.pol(0, 2));
        const per = new PAgent(Vec2.car(700, 400), Vec2.pol(0, 1.4));
        // const dummy = new CAgent(Vec2.car(140, 140), Vec2.pol(0, 1));
        const dummy2 = new LAgent(Vec2.car(140, 140), Vec2.pol(0.5 * PI, 1));

        eva.setTarget(dummy2);
        per.setTarget(dummy2);

        this.agents.push(eva);
        // this.agents.push(per);
        this.agents.push(dummy2);
    }

    update() {
        this.agents.forEach(a => a.update());
    }

    draw(ctx: Context) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.restore();

        // draw grid
        const stroke = { strokeStyle: "#BDBDBD", lineWidth: 0.75 };
        const grid = new Grid([0, 0], [this.width, this.height], [26, 16]);
        new Shape(grid, undefined, stroke).draw(ctx);

        // draw agents
        this.agents.forEach(a => {
            new Shape(new Circle(a.pos, 15), a.getFill(), a.getStroke()).draw(ctx);
        });
    }
}

export { Agent, Board };