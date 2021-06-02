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

    /**
     * The radius of this vehicle's bounding circle. The origin
     * of the circle is this vehicle's position.
     */
    readonly radius: number;
}