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
    public static getAngleAway(me: IDrivableVehicle, enemy: IVehicle, angleToEnemy: number, terrain: ITerrain) {
        // Used if the agent is against a wall (not a corner) and needs to run in a direction besides 180 degrees away
        const myXPositionMesh = terrain.mesh.getI(me.position.x);
        const myYPositionMesh = terrain.mesh.getJ(me.position.y);
        if (!terrain.isLegalCell(myXPositionMesh - 1, myYPositionMesh) || !terrain.isLegalCell(myXPositionMesh + 1, myYPositionMesh)) {
            if (enemy.position.x <= me.position.x && enemy.position.y <= me.position.y) { // enemy is left and above me
                angleToEnemy = 0.5 * Math.PI;
            } else if (enemy.position.x <= me.position.x && enemy.position.y >= me.position.y) { //enemy is left and below me
                angleToEnemy = -0.5 * Math.PI;
            } else if (enemy.position.x >= me.position.x && enemy.position.y <= me.position.y) { // enemy is right and above me
                angleToEnemy = 0.5 * Math.PI;
            } else { // enemy is right and below me
                angleToEnemy = -0.5 * Math.PI;
            }
        } else if (!terrain.isLegalCell(myXPositionMesh, myYPositionMesh - 1) || !terrain.isLegalCell(myXPositionMesh, myYPositionMesh + 1)) {
            if (enemy.position.x <= me.position.x && enemy.position.y <= me.position.y) { // enemy is left and above me
                angleToEnemy = 0;
            } else if (enemy.position.x <= me.position.x && enemy.position.y >= me.position.y) { //enemy is left and below me
                angleToEnemy = 0;
            } else if (enemy.position.x >= me.position.x && enemy.position.y <= me.position.y) { // enemy is right and above me
                angleToEnemy = Math.PI;
            } else { // enemy is right and below me
                angleToEnemy = Math.PI;
            }
        }
        return angleToEnemy;
    }
    public static isStuckInCorner(me: IDrivableVehicle, terrain: ITerrain) {
        const myXPositionMesh = terrain.mesh.getI(me.position.x);
        const myYPositionMesh = terrain.mesh.getJ(me.position.y);
        let validDirectionsArr: number = 0;
        for (let i = -1; i <= 1; i++) {
            if (!terrain.isLegalCell(myXPositionMesh + i, myYPositionMesh) && i != 0) {
                validDirectionsArr += 1;
            }
        }
        for (let j = -1; j <= 1; j++) {
            if (!terrain.isLegalCell(myXPositionMesh, myYPositionMesh + j) && j != 0) {
                validDirectionsArr += 1;
            }
        }
        if (validDirectionsArr >= 2) {
            return true;
        } else {
            return false;
        }
    }
    
    public static isNextToWall(me: IDrivableVehicle, terrain: ITerrain) {
        const myXPositionMesh = terrain.mesh.getI(me.position.x);
        const myYPositionMesh = terrain.mesh.getJ(me.position.y);
        for (let i = -1; i <= 1; i++) {
            if (!terrain.isLegalCell(myXPositionMesh + i, myYPositionMesh) && i != 0) {
                return true;
            }
        }
        for (let j = -1; j <= 1; j++) {
            if (!terrain.isLegalCell(myXPositionMesh, myYPositionMesh + j) && j != 0) {
                return true;
            }
        }
    }

    public static getAngleFromCorner(me: IDrivableVehicle, enemy: IVehicle, terrain: ITerrain, angleToClosestEnemy: number) {
        const myXPositionMesh = terrain.mesh.getI(me.position.x);
        const myYPositionMesh = terrain.mesh.getJ(me.position.y);
        let validDirectionsArr: Array<number> = [];
        if (terrain.isLegalCell(myXPositionMesh - 1, myYPositionMesh)) {
            validDirectionsArr.push(Math.PI);
        } else if (terrain.isLegalCell(myXPositionMesh + 1, myYPositionMesh)) {
            validDirectionsArr.push(0);
        } else if (terrain.isLegalCell(myXPositionMesh, myYPositionMesh - 1)) {
            validDirectionsArr.push(-0.5 * Math.PI);
        } else if (terrain.isLegalCell(myXPositionMesh, myYPositionMesh + 1)) {
            validDirectionsArr.push(0.5 * Math.PI);
        } 
        
        let deltaX = Math.abs(me.position.x - enemy.position.x);
        let deltaY = Math.abs(me.position.y - enemy.position.y);
        let output = 0;
        if (deltaX > deltaY) {
            if (validDirectionsArr.includes(-0.5 * Math.PI)) {
                output = -0.5 * Math.PI;
            } else if (validDirectionsArr.includes(0.5 * Math.PI)) {
                output = 0.5 * Math.PI;
            }
        } else if (deltaX < deltaY) {
            if (validDirectionsArr.includes(0)) {
                output = 0;
            } else if (validDirectionsArr.includes(Math.PI)) {
                output = Math.PI;
            }
        }
        
        return output;
    }

    public act = (me: IDrivableVehicle, perspective: IAgentPerspective) => {
        // If I have reached my target or I am not moving (because I have
        // collided with something), then assign another another random taraget.
        if (this._isCaptured == true) {
            me.break();
            return;
        }
        if (this._actionCountdown == 0) {
            this._actionCountdown = 10;
            const closestEnemy:IVehicle = RunawayAgent.getClosestEnemy(me, perspective.enemies);
            const angleToClosestEnemy = me.position.lookAt(closestEnemy.position).angle;
            let angleToGo:number = 0;
            if (RunawayAgent.isNextToWall(me, perspective.terrain)) {
                if (RunawayAgent.isStuckInCorner(me, perspective.terrain)) { // stuck in corner condition
                    angleToGo = RunawayAgent.getAngleFromCorner(me, closestEnemy, perspective.terrain, angleToClosestEnemy);
                } else { //against a wall condition
                    angleToGo = RunawayAgent.getAngleAway(me, closestEnemy, angleToClosestEnemy, perspective.terrain);
                }
            } else { //all other cases, just run from the closest pursuer
                angleToGo = angleToClosestEnemy + Math.PI;
            }
            me.steerTo(angleToGo);
            me.gas(); 
            this._actionCountdown -= 1;
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