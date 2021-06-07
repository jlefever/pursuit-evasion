import IAgent from "./IAgent";
import IAgentPerspective from "./IAgentPerspective";
import IDrivableVehicle from "../motion/IDrivableVehicle";
import ITerrain from "../terrain/ITerrain";
import Vector from "../geometry/Vector";

export default class RandomAgent implements IAgent {
    private _target: Vector;
    public _actionCountdown: number;
    public _isCaptured: boolean;

    public constructor() {
        this._target = Vector.zero();
        this._isCaptured = false;
        this._actionCountdown = 0;
    }
    public isCaptured (): boolean {
        return this._isCaptured;
    }
    public act = (me: IDrivableVehicle, perspective: IAgentPerspective) => {
        // If I have reached my target or I am not moving (because I have
        // collided with something), then assign another another random taraget.
        if (this._isCaptured == true) {
            me.break();
            return;
        }
        // Only change actions everytime actionCountdown is 0. This is an assumption in DQNs that improves convergence.
        if (this._actionCountdown == 0) {
            this._actionCountdown = 10;
            if (me.position.dist(this._target) < 10 || me.velocity.isZero) {
                this._target = this.getRandomTarget(perspective.terrain);
            }
    
            const angle = me.position.lookAt(this._target).angle;
            me.steerTo(angle);
            me.gas();
        } else {
            me.gas();
            this._actionCountdown -= 1;
        }
    }
    public wasCaught = () => {
        this._isCaptured = true;
    }
    private getRandomTarget(terrain: ITerrain): Vector {
        return Vector.car(Math.random() * terrain.width, Math.random() * terrain.height);
    }
}