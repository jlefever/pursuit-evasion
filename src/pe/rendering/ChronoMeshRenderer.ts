import IMesh from "../grid/IMesh";
import MeshRenderer from "./MeshRenderer";
import ITeamChronoPoint from "../game/ITeamChronoPoint";
import Team from "../game/Team";

export default class ChronoMeshRenderer<T extends ITeamChronoPoint> extends MeshRenderer<T> {
    constructor(mesh: IMesh<T>) {
        super(mesh);
    }

    public getBoundsColor = (p: T) => {
        if (p.team == Team.EVADERS) {
            return "rgb(0, 0, 255, 0.5)";
        } else if (p.team == Team.PURSUERS) {
            return "rgb(255, 0, 0, 0.5)";
        } else {
            return "rgb(0, 0, 0, 0)";
        }
    }

    public beforeRender = () => { }
}