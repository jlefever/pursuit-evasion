import ITerrain from "../terrain/ITerrain";
import IGameWorld from "../game/IGameWorld";
import TerrainRenderer from "./TerrainRenderer";
import EvaderRenderer from "./EvaderRenderer";
import GridLinesRenderer from "./GridLinesRenderer";
import IRenderer from "./IRenderer";
import IRenderingContext from "./IRenderingContext";
import PursuerRenderer from "./PursuerRenderer";
import ChronoMeshRenderer from "./ChronoMeshRenderer";

export default class Renderer {
    private readonly _terrain: ITerrain;
    private readonly _renderers: IRenderer[];

    public constructor(world: IGameWorld) {
        this._terrain = world.terrain;
        const renderers = new Array<IRenderer>();
        const { numHCells, numVCells, cellSize } = world.terrain;
        renderers.push(new GridLinesRenderer(numHCells, numVCells, cellSize));
        renderers.push(new ChronoMeshRenderer(world.chronoMesh));
        renderers.push(new TerrainRenderer(world.terrain.mesh));
        renderers.push(...world.pursuers.map(p => new PursuerRenderer(p)));
        renderers.push(...world.evaders.map(e => new EvaderRenderer(e)));
        this._renderers = renderers;
    }

    public render = (ctx: IRenderingContext, alpha: number) => {
        ctx.clearRect(0, 0, this._terrain.width, this._terrain.height);
        this._renderers.forEach(r => {
            ctx.save();
            r.render(ctx, alpha);
            ctx.restore();
        });
    }
}