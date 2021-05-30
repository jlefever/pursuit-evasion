import IAgent from "./IAgent";
import IAgentPerspective from "./IAgentPerspective";
import IDrivableVehicle from "../motion/IDrivableVehicle";
import ITerrian from "../terrian/ITerrian";
import Vector from "../geometry/Vector";

export default class RandomAgent implements IAgent {
    private _target: Vector;

    public constructor() {
        this._target = Vector.zero();
    }

    public act = (me: IDrivableVehicle, perspective: IAgentPerspective) => {
        // If I have reached my target or I am not moving (because I have
        // collided with something), then assign another another random taraget.
        if (me.position.dist(this._target) < 10 || me.velocity.isZero) {
            this._target = this.getRandomTarget(perspective.terrian);
        }

        const angle = me.position.lookAt(this._target).angle;
        me.steerTo(angle);
        me.gas();
    }

    private getRandomTarget(terrian: ITerrian): Vector {
        return Vector.car(Math.random() * terrian.width, Math.random() * terrian.height);
    }
}