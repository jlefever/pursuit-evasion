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

function grid(size: Vec2, width: number, height: number): Path2D {
    const cellW = width / size.x;
    const cellH = height / size.y;

    const root = new Path2D();

    for (let i = 0; i <= size.x; i++) {
        const x = i * cellW;
        const line = new Path2D();
        line.moveTo(x, 0);
        line.lineTo(x, height);
        root.addPath(line);
    }

    for (let i = 0; i <= size.y; i++) {
        const y = i * cellH;
        const line = new Path2D();
        line.moveTo(0, y);
        line.lineTo(width, y);
        root.addPath(line);
    }

    return root;
}

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

interface AgentStyle {
    fill: Fill;
    stroke: Stroke;
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
        return this.pos.lookAt(this.target!.pos).angle;
    }

    getStyle() {
        return {
            fill: { fillStyle: "#79BEE0" },
            stroke: { strokeStyle: "#67A1BD", lineWidth: 3 }
        };
    }
}

class EAgent extends Agent {
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
        const dummy = new CAgent(Vec2.car(140, 140), Vec2.pol(0, 1));
        // const dummy2 = new LAgent(Vec2.car(140, 140), Vec2.pol(0.5 * PI, 1));

        per.setTarget(eva);

        this.agents.push(eva);
        this.agents.push(per);
        this.agents.push(dummy);
    }

    update() {
        this.agents.forEach(a => a.update());
    }

    draw(ctx: Context) {
        // ctx.save();
        // ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.width, this.height);
        // ctx.restore();

        // draw grid
        const g = grid(Vec2.car(26, 16), this.width, this.height);
        draw(ctx, g, undefined, { strokeStyle: "#BDBDBD", lineWidth: 0.75 })

        // draw agents
        this.agents.forEach(a => {
            const style = a.getStyle();
            draw(ctx, circle(a.pos, 15), style.fill, style.stroke);
            drawArrow(ctx, a.pos, a.vel.angle, 28, 8);
        });
    }
}

export { Agent, Board };
