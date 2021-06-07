import ITerrain from "../terrain/ITerrain";
import IVehicle from "../motion/IVehicle";

export default interface IAgentPerspective {
    readonly terrain: ITerrain;
    readonly friends: readonly IVehicle[];
    readonly enemies: readonly IVehicle[];
}