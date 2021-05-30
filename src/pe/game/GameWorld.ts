import Driver from "./Driver";
import Car from "../motion/Car";
import ITerrian from "../terrian/ITerrian";
import IPoint from "../geometry/IPoint";
import IUpdatable from "./IUpdatable";
import IGameWorld from "./IWorld";
import IAgent from "../agency/IAgent";
import IPhysics from "./IPhysics";
import Victory from "./Victory";
import GameDefaults from "./GameDefaults";

type VictoryCallback = (victory: Victory) => void;

export default class GameWorld implements IGameWorld, IUpdatable {
    private readonly _physics: IPhysics;
    private readonly _terrian: ITerrian;
    private readonly _pursuers: Driver[];
    private readonly _evaders: Driver[];
    private _victory?: Victory;
    private _victoryCallback?: VictoryCallback;
    private _currGameLength: number;
    private _topPursuerSpeed: number;
    private _topEvaderSpeed: number;
    private _captureDistance: number;
    private _maxGameLength: number;
    
    public constructor(terrian: ITerrian, physics: IPhysics, victoryCallback?: VictoryCallback) {
        this._physics = physics
        this._terrian = terrian;
        this._pursuers = [];
        this._evaders = [];
        this._victory = undefined;
        this._victoryCallback = victoryCallback;
        this._currGameLength = 0;

        this._topPursuerSpeed = GameDefaults.TOP_PURSUER_SPEED
        this._topEvaderSpeed = GameDefaults.TOP_EVADER_SPEED;
        this._captureDistance = GameDefaults.CAPTURE_DISTANCE;
        this._maxGameLength = GameDefaults.MAX_GAME_LENGTH;
    }

    public get terrian() {
        return this._terrian;
    }

    public get pursuers() {
        return this._pursuers.map(a => a.vehicle);
    }

    public get evaders() {
        return this._evaders.map(a => a.vehicle);
    }

    public get victory() {
        return this._victory;
    }

    public get topPursuerSpeed() {
        return this._topPursuerSpeed;
    }

    public set topPursuerSpeed(value: number) {
        this._topPursuerSpeed = value;
        this._pursuers.forEach(p => p.vehicle.topSpeed = value);
    }

    public get topEvaderSpeed() {
        return this._topEvaderSpeed;
    }

    public set topEvaderSpeed(value: number) {
        this._topEvaderSpeed = value;
        this._evaders.forEach(p => p.vehicle.topSpeed = value);
    }

    public get captureDistance() {
        return this._captureDistance;
    }

    public set captureDistance(value: number) {
        this._captureDistance = value;
    }

    public get maxGameLength() {
        return this._maxGameLength;
    }

    public set maxGameLength(value: number) {
        this._maxGameLength = value;
    }

    public set victoryCallback(value: VictoryCallback) {
        this._victoryCallback = value;
    }

    public spawnPursuer = (agent: IAgent, position: IPoint) => {
        const vehicle = new Car(position, this.topPursuerSpeed);
        const driver = new Driver(agent, vehicle, this);
        this._physics.addParticle(vehicle);
        this._pursuers.push(driver);
    }

    public spawnEvader = (agent: IAgent, position: IPoint) => {
        const vehicle = new Car(position, this.topEvaderSpeed);
        const driver = new Driver(agent, vehicle, this);
        this._physics.addParticle(vehicle);
        this._evaders.push(driver);
    }

    public update = () => {
        this._currGameLength += 1;
        this._pursuers.forEach(a => a.update());
        this._evaders.forEach(a => a.update());
        this._physics.update();
        this.checkWinConditions();
    }

    private checkWinConditions = () => {
        if (this._currGameLength >= this.maxGameLength) {
            this._victory = Victory.EVADER_WIN;

            if (this._victoryCallback) {
                this._victoryCallback(this._victory);
            }

            return;
        }

        for (const p of this.pursuers) {
            for (const e of this.evaders) {
                if (p.position.dist(e.position) <= this.captureDistance) {
                    this._victory = Victory.PURSUER_WIN;

                    if (this._victoryCallback) {
                        this._victoryCallback(this._victory);
                    }
                    
                    return;
                }
            }
        }
        
        // The game continues even after victory unless stopped by victoryCallback.
        this._victory = undefined;
    }
}