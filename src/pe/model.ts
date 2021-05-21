type Pos = [number, number];

type Context = CanvasRenderingContext2D;

interface Updatable {
    update(): void;
}

interface Drawable {
    draw(ctx: Context): void;
}

class Agent implements Drawable, Updatable {
    public readonly pos: Pos;
    public readonly radius: number;

    constructor(pos: Pos, radius: number) {
        this.pos = pos;
        this.radius = radius;
    }

    update() {
        this.pos[0] += 0.4;
        this.pos[1] += 0.2;
    }

    draw(ctx: Context) {
        ctx.fillStyle = "#B486F0";
        ctx.strokeStyle = "#D8C4F2"
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(this.pos[0], this.pos[1], this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
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
            new Agent([100, 400], 65),
            new Agent([200, 200], 120)
        ];
    }

    update() {
        this.agents.forEach(a => a.update());
    }

    draw(ctx: Context) {
        // // Store the current transformation matrix
        // ctx.save();

        // // Use the identity matrix while clearing the canvas
        // ctx.setTransform(1, 0, 0, 1, 0, 0);
        // ctx.clearRect(0, 0, this.width, this.height);

        // // Restore the transform
        // ctx.restore();

        ctx.clearRect(0, 0, this.width, this.height);
        this.agents.forEach(a => a.draw(ctx));
    }
}

export { Agent, Board };