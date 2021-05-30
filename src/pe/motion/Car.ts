import IDrivable from "./IDrivable";
import IPoint from "../geometry/IPoint";
import IVehicle from "./IVehicle";
import Vector from "../geometry/Vector";

/**
 * A self-propelled particle which can be driven.
 */
export default class Car implements IDrivable, IVehicle {
    private _position: Vector;
    private _velocity: Vector;
    private _topSpeed: number;
    private _heading: number;

    /**
     * @param position The initial position of this vehicle.
     * @param topSpeed The maximum speed this vehicle can travel.
     */
    public constructor(position: IPoint, topSpeed: number) {
        this._position = Vector.fromPoint(position);
        this._velocity = Vector.zero();
        this._topSpeed = topSpeed;
        this._heading = this._velocity.angle;
    }

    public get position() {
        return this._position;
    }

    public get velocity() {
        return this._velocity;
    }

    public set velocity(value: Vector) {
        this._velocity = value;
    }

    public set position(value: Vector) {
        this._position = value;
    }

    public get topSpeed() {
        return this._topSpeed;
    }

    public set topSpeed(value: number) {
        this._topSpeed = value;
    }

    public get heading() {
        return this._heading;
    }

    /**
     * Steer this vehicle so it is facing a given direction.
     * @param angle The angle (in radians) this vehicle should face.
     */
    public steerTo(angle: number) {
        this._heading = angle;
        this._velocity = this._velocity.rotateTo(angle);
    }

    /**
     * Ensure this vehicle is not moving.
     */
    public break() {
        if (!this.velocity.isZero) {
            this._velocity = Vector.zero();
        }
    }

    /**
     * Ensure this vehicle is moving.
     */
    public gas() {
        if (this.velocity.isZero) {
            this._velocity = Vector.pol(this._heading, this._topSpeed);
        }
    }
}