import IAgent from "./IAgent";
import IAgentPerspective from "./IAgentPerspective";
import IDrivableVehicle from "../motion/IDrivableVehicle";
import ITerrain from "../terrain/ITerrain";
import Vector from "../geometry/Vector";
import IVehicle from "../motion/IVehicle";

export default class RunawayAgent implements IAgent {
    private _target: Vector;
    public _isCaptured: boolean;
    public _actionCountdown: number;

    public constructor() {
        this._target = Vector.zero();
        this._isCaptured = false;
        this._actionCountdown = 0;
    }
    public isCaptured (): boolean {
        return this._isCaptured;
    }
    public static getClosestEnemy(me: IDrivableVehicle, enemies: readonly IVehicle []) {
        let closestEnemy:IVehicle = enemies[0];
        let closestDistance:number = 9999999;
        for (const enemy of enemies) {
            if (me.position.dist(enemy.position) <= closestDistance) {
                closestDistance = me.position.dist(enemy.position);
                closestEnemy = enemy;
            }
        }
        return closestEnemy;
    }
    public static getAngleAway(me: IDrivableVehicle, enemy: IVehicle, angleToEnemy: number) {
        // Used if the agent is against a wall (not a corner) and needs to run in a direction besides 180 degrees away
        if (enemy.position.x <= me.position.x && enemy.position.y <= me.position.y) { // enemy is left and above me
            angleToEnemy = angleToEnemy - 0.5 * Math.PI;
        } else if (enemy.position.x <= me.position.x && enemy.position.y >= me.position.y) { //enemy is left and below me
            angleToEnemy = angleToEnemy + 0.5 * Math.PI;
        } else if (enemy.position.x >= me.position.x && enemy.position.y <= me.position.y) { // enemy is right and above me
            angleToEnemy = angleToEnemy + 0.5 * Math.PI;
        } else { // enemy is right and below me
            angleToEnemy = angleToEnemy - 0.5 * Math.PI;
        }
        return angleToEnemy;
    }
    public static isStuckInCorner(me: IDrivableVehicle, terrain: ITerrain) {
        const myXPositionMesh = terrain.mesh.getI(me.position.x);
        const myYPositionMesh = terrain.mesh.getJ(me.position.y);
        let invalidDirectionsArr: number = 0;
        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j <= 1; j++) {
                if (!terrain.isLegalCell(myXPositionMesh + i, myYPositionMesh + j)) {
                    invalidDirectionsArr += 1;
                }
            }
        }
        if (invalidDirectionsArr >= 2) {
            return true;
        } else {
            return false;
        }
    }

    public act = (me: IDrivableVehicle, perspective: IAgentPerspective) => {
        // If I have reached my target or I am not moving (because I have
        // collided with something), then assign another another random taraget.
        if (this._isCaptured == true) {
            me.break();
            return;
        }
        if (this._actionCountdown == 0) {
            const closestEnemy:IVehicle = RunawayAgent.getClosestEnemy(me, perspective.enemies);
            const angleToClosestEnemy = me.position.lookAt(closestEnemy.position).angle;
            let angleToGo:number = 0;
            if (me.velocity.isZero) {
                if (RunawayAgent.isStuckInCorner(me, perspective.terrain)) { // stuck in corner condition
                    this._target = this.getRandomTarget(perspective.terrain);
                    angleToGo = me.position.lookAt(this._target).angle;
                } else { //against a wall condition
                    angleToGo = RunawayAgent.getAngleAway(me, closestEnemy, angleToClosestEnemy);
                }
            } else { //all other cases, just run from the closest pursuer
                angleToGo = angleToClosestEnemy + Math.PI;
            }

            // const angle = me.position.lookAt(this._target).angle;
            me.steerTo(angleToGo);
            me.gas();
        } else {
            me.gas();
            this._actionCountdown -= 1;
            if (this._actionCountdown == -1) {
                this._actionCountdown = 4;
            }
        }
    }
    public wasCaught = () => {
        this._isCaptured = true;
    }
    private getRandomTarget(terrain: ITerrain): Vector {
        return Vector.car(Math.random() * terrain.width, Math.random() * terrain.height);
    }
}