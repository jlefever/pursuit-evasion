import ITerrian from "../terrian/ITerrian";
import IGameWorld from "../game/IGameWorld";
import TerrianRenderer from "./TerrianRenderer";
import EvaderRenderer from "./EvaderRenderer";
import GridLinesRenderer from "./GridLinesRenderer";
import IRenderer from "./IRenderer";
import IRenderingContext from "./IRenderingContext";
import PursuerRenderer from "./PursuerRenderer";

export default class Renderer {
    private readonly _terrian: ITerrian;
    private readonly _renderers: IRenderer[];

    public constructor(world: IGameWorld) {
        this._terrian = world.terrian;
        const renderers = new Array<IRenderer>();
        const { numHCells, numVCells, cellSize } = world.terrian;
        renderers.push(new GridLinesRenderer(numHCells, numVCells, cellSize));
        renderers.push(new TerrianRenderer(world.terrian.mesh));
        renderers.push(...world.pursuers.map(p => new PursuerRenderer(p)));
        renderers.push(...world.evaders.map(e => new EvaderRenderer(e)));
        this._renderers = renderers;
    }

    public render = (ctx: IRenderingContext, alpha: number) => {
        ctx.clearRect(0, 0, this._terrian.width, this._terrian.height);
        this._renderers.forEach(r => {
            ctx.save();
            r.render(ctx, alpha);
            ctx.restore();
        });
    }
}