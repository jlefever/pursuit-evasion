import IAgentPerspective from "./IAgentPerspective";
import IDrivableVehicle from "../motion/IDrivableVehicle";

export default interface IAgent {
    readonly act: (me: IDrivableVehicle, perspective: IAgentPerspective) => void;
}