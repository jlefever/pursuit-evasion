import ITerrianPoint from "../terrian/ITerrianPoint";
import IMesh from "../grid/IMesh";
import MeshRenderer from "./MeshRenderer";

export default class TerrianRenderer<T extends ITerrianPoint> extends MeshRenderer<T> {
    constructor(mesh: IMesh<T>) {
        super(mesh);
    }

    public getBoundsColor = (p: T) => p.isObstacle ? `rgb(100,100,100)` : `rgba(0,0,0,0)`;

    public beforeRender = () => { }
}