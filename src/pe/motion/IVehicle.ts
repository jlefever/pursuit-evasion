import IParticle from "./IParticle";

/**
 * A self-propelled particle.
 */
export default interface IVehicle extends IParticle {
    /**
     * This vehicle's maximum speed.
     */
    readonly topSpeed: number;

    /**
     * The angle this vehicle is currently facing.
     */
    readonly heading: number;
}