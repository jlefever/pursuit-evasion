import { createContext } from "preact";

type Pos = [number, number];

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
    public readonly pos: Pos;
    public readonly radius: number;
    private readonly _p: Path2D;

    constructor(pos: Pos, radius: number) {
        const [x , y] = pos;
        this.pos = pos;
        this.radius = radius;
        this._p = new Path2D();
        this._p.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
    }

    toPath2D() {
        return this._p;
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

class Agent implements Updatable {
    readonly pos: Pos;
    readonly radius: number;

    constructor(pos: Pos, radius: number) {
        this.pos = pos;
        this.radius = radius;
    }

    update() {
        this.pos[0] += 0.4;
        // this.pos[1] += 0.2;
    }

    getPath(): Path {
        return new Circle(this.pos, this.radius);
    }
}

class Board implements Drawable, Updatable {
    public readonly agents: Agent[];
    public readonly width: number;
    public readonly height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this.agents = [
            new Agent([100, 100], 25),
            new Agent([100, 200], 25),
            new Agent([100, 300], 25),
        ];
    }

    update() {
        this.agents.forEach(a => a.update());
    }

    draw(ctx: Context) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.restore();

        const fill1 = { fillStyle: "#7EE0B1" };
        const stroke1 = { strokeStyle: "#68BA93", lineWidth: 3 };

        const fill2 = { fillStyle: "#79BEE0" };
        const stroke2 = { strokeStyle: "#67A1BD", lineWidth: 3 };

        const fill3 = { fillStyle: "#E0A06E" };
        const stroke3 = { strokeStyle: "#BD875D", lineWidth: 3 };

        ctx.clearRect(0, 0, this.width, this.height);
        new Shape(this.agents[0].getPath(), fill1, stroke1).draw(ctx);
        new Shape(this.agents[1].getPath(), fill2, stroke2).draw(ctx);
        new Shape(this.agents[2].getPath(), fill3, stroke3).draw(ctx);
    }
}

export { Agent, Board };