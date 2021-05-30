import IEnvironmentPoint from "../IEnvironmentPoint";
import IMesh from "../IMesh";
import MeshRenderer from "./MeshRenderer";

export default class EnvironmentRenderer<T extends IEnvironmentPoint> extends MeshRenderer<T> {
    constructor(mesh: IMesh<T>) {
        super(mesh);
    }

    public getBoundsColor = (p: T) => p.isObstacle ? `rgba(255,255,255,255)` : `rgba(0,0,0,0)`;

    public beforeRender = () => { }
}