import Driver from "./Driver";
import Car from "../motion/Car";
import ITerrian from "../terrian/ITerrian";
import IPoint from "../geometry/IPoint";
import IUpdatable from "./IUpdatable";
import IGameWorld from "./IWorld";
import IAgent from "../agency/IAgent";
import IPhysics from "./IPhysics";
import Victory from "./Victory";

const PURSUER_TOP_SPEED = 8;
const EVADER_TOP_SPEED = 8;
const CAPTURE_DISTANCE = 2;
const MAX_GAME_LENGTH = 20 * 30;

export default class GameWorld implements IGameWorld, IUpdatable {
    private readonly _physics: IPhysics;
    private readonly _terrian: ITerrian;
    private readonly _pursuers: Driver[];
    private readonly _evaders: Driver[];
    private _victory: Victory;
    private _gameLength: number;
    
    public constructor(terrian: ITerrian, physics: IPhysics) {
        this._physics = physics
        this._terrian = terrian;
        this._pursuers = [];
        this._evaders = [];
        this._victory = Victory.NOT_YET;
        this._gameLength = 0;
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

    public spawnPursuer = (agent: IAgent, position: IPoint) => {
        const vehicle = new Car(position, PURSUER_TOP_SPEED);
        const driver = new Driver(agent, vehicle, this);
        this._physics.addParticle(vehicle);
        this._pursuers.push(driver);
    }

    public spawnEvader = (agent: IAgent, position: IPoint) => {
        const vehicle = new Car(position, EVADER_TOP_SPEED);
        const driver = new Driver(agent, vehicle, this);
        this._physics.addParticle(vehicle);
        this._evaders.push(driver);
    }

    public update = () => {
        this._pursuers.forEach(a => a.update());
        this._evaders.forEach(a => a.update());
        this._physics.update();
        this.checkWinConditions();
    }

    private checkWinConditions = () => {
        if (this._gameLength >= MAX_GAME_LENGTH) {
            this._victory = Victory.EVADER_WIN;
            return;
        }

        for (const p of this.pursuers) {
            for (const e of this.evaders) {
                if (p.position.dist(e.position) <= CAPTURE_DISTANCE) {
                    this._victory = Victory.PURSUER_WIN;
                    return;
                }
            }
        }
        
        this._victory = Victory.NOT_YET;
    }
}