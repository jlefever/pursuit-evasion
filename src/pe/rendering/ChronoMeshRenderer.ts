import IChronoPoint from "../IChronoPoint";
import IMesh from "../IMesh";
import MeshRenderer from "./MeshRenderer";

export default class ChronoMeshRenderer<T extends IChronoPoint> extends MeshRenderer<T> {
    private _maxTtr?: number;

    constructor(mesh: IMesh<T>) {
        super(mesh);
    }

    public getBoundsColor = (p: T) => {
        if (!this._maxTtr) return "yellow"; // error
        const scale = p.ttr / this._maxTtr;
        return `rgb(${scale * 127}, 0, 0)`;
    }

    public beforeRender = () => {
        this._maxTtr = Number.NEGATIVE_INFINITY;

        this.mesh.forEach(p => {
            if (p.ttr > this._maxTtr!) {
                this._maxTtr = p.ttr;
            }
        });
    }
}