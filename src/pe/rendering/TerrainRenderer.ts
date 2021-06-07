import ITerrainPoint from "../terrain/ITerrainPoint";
import IMesh from "../grid/IMesh";
import MeshRenderer from "./MeshRenderer";

export default class TerrainRenderer<T extends ITerrainPoint> extends MeshRenderer<T> {
    constructor(mesh: IMesh<T>) {
        super(mesh);
    }

    public getBoundsColor = (p: T) => p.isObstacle ? `rgb(100,100,100)` : `rgba(0,0,0,0)`;

    public beforeRender = () => { }
}