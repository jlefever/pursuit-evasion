import IMesh from "../IMesh";
import IMeshPoint from "../IMeshPoint";
import IRenderer from "./IRenderer";
import IRenderingContext from "./IRenderingContext";

export default abstract class MeshRenderer<T extends IMeshPoint> implements IRenderer {
    private readonly _mesh: IMesh<T>;

    public constructor(mesh: IMesh<T>) {
        this._mesh = mesh;
    }

    public get mesh() {
        return this._mesh;
    }

    public render = (ctx: IRenderingContext, alpha: number) => {
        this.beforeRender();
        this._mesh.forEach(p => {
            const { origin, size } = p.bounds;
            ctx.fillStyle = this.getBoundsColor(p);
            ctx.fillRect(origin.x, origin.y, size, size);
        });
    }

    protected abstract getBoundsColor: (point: T) => string;

    protected abstract beforeRender: () => void;
}