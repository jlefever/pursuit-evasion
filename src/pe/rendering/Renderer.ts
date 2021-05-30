import IWorld from "../IWorld";
import EnvironmentRenderer from "./EnvironmentRenderer";
import EvaderRenderer from "./EvaderRenderer";
import GridLinesRenderer from "./GridLinesRenderer";
import IRenderer from "./IRenderer";
import IRenderingContext from "./IRenderingContext";
import PursuerRenderer from "./PursuerRenderer";

export default class Renderer {
    private readonly _renderers: IRenderer[];

    public constructor(world: IWorld) {
        const renderers = new Array<IRenderer>();
        const { numHCells, numVCells, cellSize } = world.environment;
        renderers.push(new GridLinesRenderer(numHCells, numVCells, cellSize));
        renderers.push(new EnvironmentRenderer(world.environment.mesh));
        renderers.push(...world.pursuers.map(p => new PursuerRenderer(p)));
        renderers.push(...world.evaders.map(e => new EvaderRenderer(e)));
        this._renderers = renderers;
    }

    public render = (ctx: IRenderingContext, alpha: number) => {
        this._renderers.forEach(r => {
            ctx.save();
            r.render(ctx, alpha);
            ctx.restore();
        });
    }
}