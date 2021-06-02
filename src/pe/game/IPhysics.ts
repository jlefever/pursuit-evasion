import IUpdatable from "./IUpdatable";
import IVehicle from "../motion/IVehicle";

export default interface IPhysics extends IUpdatable {
    readonly addVehicle: (vehicle: IVehicle) => void;
}