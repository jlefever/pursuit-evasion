import IUpdatable from "./IUpdatable";
import IParticle from "../motion/IParticle";

export default interface IPhysics extends IUpdatable {
    readonly addParticle: (particle: IParticle) => void;
}