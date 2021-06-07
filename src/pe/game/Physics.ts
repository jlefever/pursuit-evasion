import IPoint from "../geometry/IPoint";
import Vector from "../geometry/Vector";
import IVehicle from "../motion/IVehicle";
import ITerrain from "../terrain/ITerrain";
import IPhysics from "./IPhysics";

/**
 * A 100% complete and realistic physics simulation.
 */
export default class Physics implements IPhysics {
    private readonly _terrain: ITerrain;
    private readonly _vehicles: IVehicle[];

    public constructor(terrain: ITerrain) {
        this._terrain = terrain;
        this._vehicles = new Array();
    }

    public addVehicle(vehicle: IVehicle) {
        this._vehicles.push(vehicle);
    }

    public update = () => {
        this._vehicles.forEach(p => {
            const desiredPos = p.position.add(p.velocity);

            if (this.isLegalCircle(desiredPos.x, desiredPos.y, p.radius)) {
                p.position = desiredPos;
            } else {
                p.velocity = Vector.zero();
            }
        });
    }

    private isLegalCircle = (x: number, y: number, radius: number) => {
        return this.isLegal(x - radius, y) && this.isLegal(x + radius, y)
            && this.isLegal(x, y - radius) && this.isLegal(x, y + radius);
    }

    private isLegal = (x: number, y: number) => {
        return this._terrain.isLegalPoint(x, y);
    }
}