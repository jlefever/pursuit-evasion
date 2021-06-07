import IAgent from "./IAgent";
import IAgentPerspective from "./IAgentPerspective";
import IDrivableVehicle from "../motion/IDrivableVehicle";
import ITerrain from "../terrain/ITerrain";
import Vector from "../geometry/Vector";

export default class DQNAgent implements IAgent {
    private _target: Vector;
    public _actionCountdown: number;
    public _isCaptured: boolean;
    public actionInt: number;

    public constructor() {
        this._target = Vector.zero();
        this._isCaptured = false;
        this._actionCountdown = 0;
        this.actionInt = 9;
    }
    public isCaptured = (): boolean => {
        return this._isCaptured;
    }
    
    public wasCaught = () => {
        this._isCaptured = true;
    }
    public setActionInt = (actionInt: number) => {
        this.actionInt = actionInt;
    }
    public selectAngleFromActionInt = (actionInt: number) => {
        if (actionInt == 0) {
            return 0;
        } else if (actionInt == 1) {
            return 0.25 * Math.PI   
        } else if (actionInt == 2) {
            return 0.5 * Math.PI   
        } else if (actionInt == 3) {
            return 0.75 * Math.PI   
        } else if (actionInt == 4) {
            return Math.PI   
        } else if (actionInt == 5) {
            return -0.25 * Math.PI   
        } else if (actionInt == 6) {
            return -0.50 * Math.PI   
        } else if (actionInt == 7) {
            return -0.75 * Math.PI   
        }
        return 0;
    }



    private getRandomTarget(terrain: ITerrain): Vector {
        return Vector.car(Math.random() * terrain.width, Math.random() * terrain.height);
    }

    public act = (me: IDrivableVehicle, perspective: IAgentPerspective) => {
        if (this._actionCountdown == 0) {
            this._actionCountdown = 10;
            me.steerTo(this.selectAngleFromActionInt(this.actionInt));
            me.gas();
        } else {
            this._actionCountdown -= 1;
            me.gas();
        }
    }

}