import IPoint from "./IPoint";
import IVehicle from "./IVehicle";
import Vector from "./Vector";

/**
 * A self-propelled particle which can be controlled.
 */
export default class DrivableVehicle implements IVehicle {
    private readonly _topSpeed: number;
    private _isMoving: boolean;
    private _heading: number;
    private _position: Vector;
    private _velocity: Vector;

    /**
     * @param position The initial position of this vehicle.
     * @param topSpeed The maximum speed this vehicle can travel.
     */
    public constructor(position: IPoint, topSpeed: number) {
        this._topSpeed = topSpeed;
        this._isMoving = false;
        this._heading = 0;
        this._position = Vector.fromPoint(position);
        this._velocity = Vector.zero();
    }

    public get topSpeed() {
        return this._topSpeed;
    }

    public get isMoving() {
        return this._isMoving;
    }

    public get heading() {
        return this._heading;
    }

    public get position() {
        return this._position;
    }

    public get velocity() {
        return this._velocity;
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
        if (this.isMoving) {
            this._velocity = Vector.zero();
            this._isMoving = false;
        }
    }

    /**
     * Ensure this vehicle is moving.
     */
    public gas() {
        if (!this.isMoving) {
            this._velocity = Vector.pol(this._heading, this._topSpeed);
            this._isMoving = true;
        }
    }
}