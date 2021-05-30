// function getWallIntersection(pos: Vec2, angle: number) {
//     const width = 962;
//     const height = 592;
//     const l = new Line(Vec2.car(0, 0), Vec2.car(0, height));
//     const t = new Line(Vec2.car(0, 0), Vec2.car(width, 0));
//     const r = new Line(Vec2.car(width, 0), Vec2.car(0, height));
//     const b = new Line(Vec2.car(0, height), Vec2.car(width, 0));

//     const arr = [l, t, r, b];
//     const lengths = arr.map(x => x.rayLength(pos, angle));
//     const a = lengths.filter(x => x != null && x >= 0);
//     return pos.add(Vec2.pol(angle, Math.min(...(a as number[]))));
// }

// function rgb(r: number, g: number, b: number) {
//     return `rgb(${r},${g},${b})`;
// }

// function findMax(mesh: ArrayMesh<MarchingPoint>) {
//     let max = Number.NEGATIVE_INFINITY;

//     mesh.forEach(p => {
//         if (p.ttr == Number.POSITIVE_INFINITY) return;
//         if (p.ttr > max) max = p.ttr;
//     });

//     return max;
// }

// function drawMesh(ctx: Context, mesh: ArrayMesh<MarchingPoint>) {
//     ctx.save();

//     ctx.lineWidth = 0;
//     ctx.globalAlpha = 0.5;

//     const max = findMax(mesh);

//     mesh.forEach(p => {
//         const scale = ((p.ttr / max) * 255);
//         // const scale = 127;

//         if (p.owner == "B") {
//             ctx.fillStyle = rgb(127, 127, 127);
//         } else if (p.owner == "E") {
//             ctx.fillStyle = rgb(0, 0, scale);
//         } else if (p.owner == "P") {
//             ctx.fillStyle = rgb(scale, 0, 0);
//         }
        
//         ctx.fillRect(p.x1 | 0, p.y1 | 0, (p.x2 - p.x1) + 1, (p.y2 - p.y1)  + 1);
//     });

//     ctx.restore();
// }

// function mergeMeshs(a: ArrayMesh<MarchingPoint>, b: ArrayMesh<MarchingPoint>) {
//     a.forEach(p1 => {
//         const p2 = b.access(p1.i, p1.j);


//         if (Math.abs(p1.ttr - p2.ttr) < 0) {
//             p1.owner = "B";
//             p2.owner = "B";
//         } else if (p1.ttr > p2.ttr) {
//             p1.owner = "E";
//             p2.owner = "E";
//         } else {
//             p1.owner = "P";
//             p2.owner = "P";
//         }
//     });
// }

// function drawDebugDot(ctx: Context, x: number, y: number) {
//     ctx.save();
//     ctx.lineWidth = 0;
//     ctx.fillStyle = "red";
//     ctx.fill(circle(Vec2.car(x, y), 3));
//     ctx.restore();
// }

// class Board implements Updatable {
//     public readonly agents: Agent[];
//     public readonly width: number;
//     public readonly height: number;
//     public readonly grid: Grid;
//     private readonly _marcherE: Marcher;
//     private readonly _marcherP: Marcher;

//     constructor(width: number, height: number) {
//         this.width = width;
//         this.height = height;
//         this.grid = new Grid(Vec2.car(26, 26), width, height);

//         this.grid.setTerrian(10, 10);
//         this.grid.setTerrian(10, 11);
//         this.grid.setTerrian(10, 12);

//         this._marcherE = new Marcher({ width: this.width, height: this.height }, 37);
//         this._marcherP = new Marcher({ width: this.width, height: this.height }, 37);

//         this.agents = [];
//         // const eva = new CAgent(Vec2.car(250, 250), Vec2.pol(0, 2));
//         // const per = new PAgent(Vec2.car(700, 400), Vec2.pol(0, 1.4));
//         // const per2 = new PAgent(Vec2.car(500, 400), Vec2.pol(0, 1.4));
//         // const per3 = new PAgent(Vec2.car(200, 400), Vec2.pol(0, 1.4));
//         // const dummy = new RAgent(Vec2.car(140, 140), Vec2.pol(0, 2));
//         // this.agents.push(dummy);

//         const agent1 = new RAgent(Vec2.car(500, 400), Vec2.pol(0, 5));
//         const agent2 = new RAgent(Vec2.car(100, 100), Vec2.pol(0, 5));
//         this.agents.push(agent1);
//         this.agents.push(agent2);
//     }

//     update = () => {
//         this.agents.forEach(a => a.update());

//         const posE = this.agents[0].pos;
//         const speedE = this.agents[0].vel.length;
//         this._marcherE.march(posE.x, posE.y, speedE);

//         const posP = this.agents[1].pos;
//         const speedP = this.agents[1].vel.length;
//         this._marcherP.march(posP.x, posP.y, speedP);
        
//         mergeMeshs(this._marcherE.mesh, this._marcherP.mesh);
//     }

//     draw = (ctx: Context, alpha: number) => {
//         ctx.clearRect(0, 0, this.width, this.height);

//         drawMesh(ctx, this._marcherE.mesh);

//         let mesh = this._marcherE.mesh;
//         let pos = this.agents[0].pos;
//         let x = mesh.getX(mesh.getI(pos.x));
//         let y = mesh.getY(mesh.getJ(pos.y));
//         drawDebugDot(ctx, x, y);

//         // ctx.putImageData(this._image, 0, 0);

//         // draw grid
//         draw(ctx, this.grid.lines(), undefined, { strokeStyle: "#BDBDBD", lineWidth: 0.75 })
//         draw(ctx, this.grid.terrian(), { fillStyle: "#808080" }, undefined);

//         // draw agents
//         this.agents.forEach(a => {
//             const style = a.getStyle();

//             // const pos = a.pos.add(a.vel.scale(alpha));
//             const pos = a.pos;
//             draw(ctx, circle(pos, 15), style.fill, style.stroke);
//             drawArrow(ctx, pos, a.vel.angle, 28, 8);

//             // const intersection = getWallIntersection(pos, a.vel.angle);
//             // ctx.save();
//             // ctx.lineWidth = 1;
//             // ctx.strokeStyle = "black";
//             // drawLine(ctx, pos, intersection);
//             // ctx.fillStyle = "red";
//             // ctx.fill(circle(intersection, 3));
//             // ctx.restore();
//         });
//     }
// }

// export { Agent, Board };
