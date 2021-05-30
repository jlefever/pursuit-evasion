import IAgent from "../agency/IAgent";
import IUpdatable from "./IUpdatable";
import IGameWorld from "./IWorld";
import IDrivableVehicle from "../motion/IDrivableVehicle";

export default class Driver implements IUpdatable {
    private readonly _agent: IAgent;
    private readonly _vehicle: IDrivableVehicle;
    private readonly _world: IGameWorld;

    public constructor(agent: IAgent, vehicle: IDrivableVehicle, world: IGameWorld) {
        this._agent = agent;
        this._vehicle = vehicle;
        this._world = world;
    }

    public get vehicle(): IDrivableVehicle {
        return this._vehicle;
    }

    public update() {
        const { evaders, pursuers, terrian } = this._world;

        const eIndex = evaders.indexOf(this._vehicle);
        if (eIndex != -1) {
            // Take a shallow copy without this vehicle.
            const friends = evaders.slice(0, eIndex);
            friends.push(...evaders.slice(eIndex + 1));

            // Let the agent act.
            const enemies = pursuers;
            this._agent.act(this.vehicle, { terrian, friends, enemies })
            return;
        }

        const pIndex = pursuers.indexOf(this._vehicle);
        if (pIndex != -1) {
            // Take a shallow copy without this vehicle.
            const friends = pursuers.slice(0, eIndex);
            friends.push(...pursuers.slice(eIndex + 1));

            // Let the agent act.
            const enemies = evaders;
            this._agent.act(this.vehicle, { terrian, friends, enemies })
            return;
        }

        throw Error("Vehicle is not an Evader or a Pursuer.");
    }
}