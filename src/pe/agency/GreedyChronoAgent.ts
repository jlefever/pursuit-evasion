import IAgent from "./IAgent";
import IAgentPerspective from "./IAgentPerspective";
import IDrivableVehicle from "../motion/IDrivableVehicle";
import Vector from "../geometry/Vector";
import Marcher from "../chrono/Marcher";
import IChronoPoint from "../chrono/IChronoPoint";
import IMesh from "../grid/IMesh";
import ITerrain from "../terrain/ITerrain";

export default class GreedyChronoAgent implements IAgent {
    private readonly _enemiesMarcher: Marcher;
    private readonly _friendsMarcher: Marcher;

    constructor(terrain: ITerrain) {
        this._enemiesMarcher = new Marcher(terrain);
        this._friendsMarcher = new Marcher(terrain);
    }

    public act = (me: IDrivableVehicle, perspective: IAgentPerspective) => {
        const { enemies, friends, terrain } = perspective;

        if (enemies.length === 0) return;

        const friendsSpeed = me.topSpeed;
        const enemiesSpeed = enemies[0].topSpeed;

        const friendsPos = friends.map(f => f.position);
        const enemiesPos = enemies.map(e => e.position);

        // March enemies
        this._enemiesMarcher.march(enemiesPos, enemiesSpeed);

        // March friends
        const myPos = me.position;
        this._friendsMarcher.march(friendsPos.concat(myPos), friendsSpeed);

        // Get baseline friendly area
        const baseArea = getFriendlyArea(this._enemiesMarcher.mesh, this._friendsMarcher.mesh);

        const tryMoving = (dx: number, dy: number) => {
            const newPos = myPos.add(Vector.car(dx, dy));

            if (!terrain.isLegalPoint(newPos.x, newPos.y)) {
                return Vector.zero();
            }
            
            this._friendsMarcher.march(friendsPos.concat(newPos), friendsSpeed);
            const newArea = getFriendlyArea(this._enemiesMarcher.mesh, this._friendsMarcher.mesh);

            return Vector.car(dx, dy).scaleTo(1).scale(newArea - baseArea);
        }

        const step = terrain.cellSize;

        const a = tryMoving(step, 0);
        const b = tryMoving(-step, 0);
        const c = tryMoving(0, step);
        const d = tryMoving(0, -step);

        me.steerTo(Vector.add(a, b, c, d).angle);
        me.gas();
    }
}

const getFriendlyArea = (enemies: IMesh<IChronoPoint>, friends: IMesh<IChronoPoint>) => {
    let count = 0;

    friends.forEach(friend => {
        if (friend.ttr === Number.POSITIVE_INFINITY) return;
        const enemy = enemies.getOrCreate(friend.i, friend.j);
        if (enemy.ttr <= friend.ttr) return;
        count = count + 1;
    });

    return count;
}