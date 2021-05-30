import ITerrian from "../terrian/ITerrian";
import IVehicle from "../motion/IVehicle";

export default interface IAgentPerspective {
    readonly terrian: ITerrian;
    readonly friends: readonly IVehicle[];
    readonly enemies: readonly IVehicle[];
}