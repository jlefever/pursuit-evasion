import IUpdatable from "./IUpdatable";
import IVehicle from "./IVehicle";
import IWorld from "./IWorld";

export default interface IAgent extends IUpdatable {
    readonly vehicle: IVehicle;
    readonly setWorld: (world: IWorld) => void;
}