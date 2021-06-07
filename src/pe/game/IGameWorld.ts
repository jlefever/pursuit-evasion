import ITerrain from "../terrain/ITerrain";
import IVehicle from "../motion/IVehicle";
import Victory from "./Victory";
import IMesh from "../grid/IMesh";
import ITeamChronoPoint from "./ITeamChronoPoint";

export default interface IGameWorld {
    readonly terrain: ITerrain;
    readonly pursuers: readonly IVehicle[];
    readonly evaders: readonly IVehicle[];
    readonly victory?: Victory;
    readonly chronoMesh: IMesh<ITeamChronoPoint>;
}