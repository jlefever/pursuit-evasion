import Driver from "./Driver";
import Car from "../motion/Car";
import ITerrain from "../terrain/ITerrain";
import IPoint from "../geometry/IPoint";
import IUpdatable from "./IUpdatable";
import IGameWorld from "./IGameWorld";
import IAgent from "../agency/IAgent";
import IPhysics from "./IPhysics";
import Victory from "./Victory";
import GameDefaults from "./GameDefaults";
import ChronoMap from "./ChronoMap";

type VictoryCallback = (victory: Victory) => void;

export default class GameWorld implements IGameWorld, IUpdatable {
    private readonly _physics: IPhysics;
    private readonly _terrain: ITerrain;
    private readonly _pursuers: Driver[];
    private readonly _evaders: Driver[];
    private _victory?: Victory;
    private _victoryCallback?: VictoryCallback;
    private _currGameLength: number;
    private _chronoMap: ChronoMap;
    private _topPursuerSpeed: number;
    private _topEvaderSpeed: number;
    private _captureDistance: number;
    private _maxGameLength: number;
    private _isUpdatingChronoMap: boolean;
    
    public constructor(terrain: ITerrain, physics: IPhysics, victoryCallback?: VictoryCallback) {
        this._physics = physics
        this._terrain = terrain;
        this._pursuers = [];
        this._evaders = [];
        this._victory = undefined;
        this._victoryCallback = victoryCallback;
        this._currGameLength = 0;
        this._chronoMap = new ChronoMap(terrain, this._evaders, this._pursuers);

        this._topPursuerSpeed = GameDefaults.TOP_PURSUER_SPEED
        this._topEvaderSpeed = GameDefaults.TOP_EVADER_SPEED;
        this._captureDistance = GameDefaults.CAPTURE_DISTANCE;
        this._maxGameLength = GameDefaults.MAX_GAME_LENGTH;
        this._isUpdatingChronoMap = false;
    }

    public get terrain() {
        return this._terrain;
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

    public get isUpdatingChronoMap() {
        return this._isUpdatingChronoMap;
    }

    public set isUpdatingChronoMap(value: boolean) {
        if (this._isUpdatingChronoMap && !value) {
            this._chronoMap.mesh.reset();
        }
        this._isUpdatingChronoMap = value;
    }

    public get chronoMesh() {
        return this._chronoMap.mesh;
    }

    public spawnPursuer = (agent: IAgent, position: IPoint) => {
        const vehicle = new Car(position, this.topPursuerSpeed, 15);
        const driver = new Driver(agent, vehicle, this);
        this._physics.addVehicle(vehicle);
        this._pursuers.push(driver);
    }

    public spawnEvader = (agent: IAgent, position: IPoint) => {
        const vehicle = new Car(position, this.topEvaderSpeed, 15);
        const driver = new Driver(agent, vehicle, this);
        this._physics.addVehicle(vehicle);
        this._evaders.push(driver);
    }

    public update = () => {
        this._currGameLength += 1;
        this._pursuers.forEach(a => a.update());
        this._evaders.forEach(a => a.update());
        this._physics.update();
        // this.checkWinConditions();
        this.checkIfCaught();
        if (this.isUpdatingChronoMap) {
            let sum_of_ttrs = this._chronoMap.update();
            // console.log(sum_of_ttrs[0]);
            // console.log(sum_of_ttrs[1]);
        }
    }
    private checkIfCaught = () => {
        for (const e in this._evaders) {
            for (const p in this._pursuers) {
                if (this._pursuers[p].vehicle.position.dist(this._evaders[e].vehicle.position) <= this.captureDistance) {
                    this._evaders[e].agent.wasCaught();
                }
            }
        }
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