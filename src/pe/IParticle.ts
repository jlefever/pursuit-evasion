import Vector from "./Vector";

export default interface IParticle {
    readonly position: Vector;
    readonly velocity: Vector;
}