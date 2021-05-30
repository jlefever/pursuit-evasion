import DrivableVehicle from "./DrivableVehicle";
import IAgent from "./IAgent";
import IWorld from "./IWorld";
import Vector from "./Vector";

export default class RandomAgent implements IAgent {
    private readonly _vehicle: DrivableVehicle;
    private _world?: IWorld;
    private _target?: Vector;

    constructor(vehicle: DrivableVehicle) {
        this._vehicle = vehicle;
    }

    public get vehicle() {
        return this._vehicle;
    }

    public setWorld(world: IWorld) {
        this._world = world;
    }

    public update() {
        if (!this._world) {
            throw Error("World not set!");
        }

        const { width, height } = this._world.environment;

        if (!this._target || this._vehicle.position.dist(this._target) < 10) {
            this._target = Vector.car(Math.random() * width, Math.random() * height);
        }

        const angle = this.vehicle.position.lookAt(this._target).angle;
        this.vehicle.steerTo(angle);
    }
}