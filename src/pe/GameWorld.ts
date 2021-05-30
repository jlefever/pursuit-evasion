import IAgent from "./IAgent";
import IEnvironment from "./IEnvironment";
import IUpdatable from "./IUpdatable";
import IWorld from "./IWorld";

export default class GameWorld implements IWorld, IUpdatable {
    private readonly _environment: IEnvironment;
    private readonly _pursuers: IAgent[];
    private readonly _evaders: IAgent[];
    
    public constructor(environment: IEnvironment) {
        this._environment = environment;
        this._pursuers = [];
        this._evaders = [];
    }

    public get environment() {
        return this._environment;
    }

    public get pursuers() {
        return this._pursuers;
    }

    public get evaders() {
        return this._evaders;
    }

    public addPursuer(...agents: IAgent[]) {
        agents.map(a => a.setWorld(this));
        this._pursuers.push(...agents);
    }

    public addEvaders(...agents: IAgent[]) {
        agents.map(a => a.setWorld(this));
        this._evaders.push(...agents);
    }

    public update = () => {
        // Updating pursuers before evaders probably gives the evaders a slight 
        // advantange.
        this.pursuers.map(a => a.update());
        this.evaders.map(a => a.update());
    }
}