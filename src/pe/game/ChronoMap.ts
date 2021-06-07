import Marcher from "../chrono/Marcher";
import ArrayMesh from "../grid/ArrayMesh";
import IMesh from "../grid/IMesh";
import ITerrain from "../terrain/ITerrain";
import Driver from "./Driver";
import ITeamChronoPoint from "./ITeamChronoPoint";
import IUpdatable from "./IUpdatable";
import Team from "./Team";
import TeamChronoPoint from "./TeamChronoPoint";

export default class ChronoMap implements IUpdatable {
    private readonly _marcherE: Marcher;
    private readonly _marcherP: Marcher;
    private readonly _mesh: IMesh<ITeamChronoPoint>;
    private readonly _evaders: Driver[];
    private readonly _pursuers: Driver[];

    public constructor(terrain: ITerrain, evaders: Driver[], pursuers: Driver[]) {
        this._marcherE = new Marcher(terrain);
        this._marcherP = new Marcher(terrain);
        this._mesh = new ArrayMesh<ITeamChronoPoint>(TeamChronoPoint.create, terrain.cellSize);
        this._evaders = evaders;
        this._pursuers = pursuers;
    }

    public get mesh(): IMesh<ITeamChronoPoint> {
        return this._mesh;
    }

    public update = () => {
        var sum_pursuers_ttr = 0;
        var sum_evaders_ttr = 0;

        if (this._evaders.length > 0) {
            const speed = this._evaders[0].vehicle.topSpeed;
            let filtered_evaders = this._evaders.filter(c => c.agent.isCaptured() == false)
            const origins = filtered_evaders.map(e => e.vehicle.position);
            this._marcherE.march(origins, speed);
        }

        if (this._pursuers.length > 0) {
            const speed = this._pursuers[0].vehicle.topSpeed;
            const origins = this._pursuers.map(e => e.vehicle.position);
            this._marcherP.march(origins, speed);
        }
        
        this._mesh.reset();

        this._marcherE.mesh.forEach(p => {
            if (p.ttr === Number.POSITIVE_INFINITY) return;
            const point = this._mesh.getOrCreate(p.i, p.j);
            if (point.ttr < p.ttr) return;
            point.team = Team.EVADERS;
            sum_evaders_ttr += 1;
            point.ttr = p.ttr;
        });

        this._marcherP.mesh.forEach(p => {
            if (p.ttr === Number.POSITIVE_INFINITY) return;
            const point = this._mesh.getOrCreate(p.i, p.j);
            if (point.ttr === p.ttr) {
                point.team = Team.NEITHER;
                return;
            }
            if (point.ttr < p.ttr) return;
            point.team = Team.PURSUERS;
            sum_pursuers_ttr += 1;
            point.ttr = p.ttr;
        });
        return [sum_pursuers_ttr, sum_evaders_ttr];
    }
}