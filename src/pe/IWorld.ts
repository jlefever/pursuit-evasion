import IAgent from "./IAgent";
import IEnvironment from "./IEnvironment";

export default interface IWorld {
    readonly environment: IEnvironment;
    readonly pursuers: readonly IAgent[];
    readonly evaders: readonly IAgent[];
}