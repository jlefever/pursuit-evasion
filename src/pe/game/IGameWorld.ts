import ITerrian from "../terrian/ITerrian";
import IVehicle from "../motion/IVehicle";
import Victory from "./Victory";
import IMesh from "../grid/IMesh";
import ITeamChronoPoint from "./ITeamChronoPoint";

export default interface IGameWorld {
    readonly terrian: ITerrian;
    readonly pursuers: readonly IVehicle[];
    readonly evaders: readonly IVehicle[];
    readonly victory?: Victory;
    readonly chronoMesh: IMesh<ITeamChronoPoint>;
}