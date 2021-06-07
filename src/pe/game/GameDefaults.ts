import GreedyChronoAgent from "../agency/GreedyChronoAgent";
import KeyboardInputAgent from "../agency/KeyboardInputAgent";
import RandomAgent from "../agency/RandomAgent";
import RunawayAgent from "../agency/RunawayAgent";
import Terrain from "../terrain/Terrain";
import GameWorld from "./GameWorld";
import Physics from "./Physics";

export default class GameDefaults {
    public static TOP_EVADER_SPEED = 6;
    public static TOP_PURSUER_SPEED = 6;
    public static CAPTURE_DISTANCE = 2;
    public static MAX_GAME_LENGTH = 600;

    public static createDefaultWorld(terrain: Terrain) {
        const world = new GameWorld(terrain, new Physics(terrain));

        // Set obstacles
        const boundaryArr: Array<[number, number]> = [];
        for (let i = 0; i <= terrain.numVCells; i++) {
            if (i == 0) {
                boundaryArr.push([0,0]);
            }
            else {
                boundaryArr.push([0, i]);
                boundaryArr.push([i, 0]);
                boundaryArr.push([25,i]);
                boundaryArr.push([i,25]);
            }
        }
        const allObstacles: Array<[number, number]> = [[13, 3], [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9],
        [13, 10], [13, 14], [13, 15], [13, 16], [13, 17], [13, 18], [13, 19],
        [13, 20], [13, 21], [13, 22], ...boundaryArr];
        terrain.setObstacles(...allObstacles);

        // terrain.setObstacles(
        //     [13, 3], [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9],
        //     [13, 10], [13, 14], [13, 15], [13, 16], [13, 17], [13, 18], [13, 19],
        //     [13, 20], [13, 21], [13, 22],
        //     );

        // Add agents
        const evader_1 = new RunawayAgent();
        const evader_2 = new RunawayAgent();
        const evader_3 = new RunawayAgent();
        const pursuer_1 = new RandomAgent();
        const pursuer_2 = new RandomAgent();
        // Spawn in corners away from each other
        // world.spawnEvader(evader_1, { x: 100, y: 100 });
        // world.spawnEvader(evader_2, { x: 100, y: 200 });
        // world.spawnEvader(evader_3, { x: 100, y: 300 });
        // world.spawnPursuer(pursuer_1, { x: 800, y: 800 });
        // world.spawnPursuer(pursuer_2, { x: 700, y: 700 });
        // world.spawnPursuer(new GreedyChronoAgent(terrain), { x: 700, y: 500 });

        // Spawn very close to each other
        world.spawnEvader(evader_1, { x: 400, y: 500 });
        world.spawnEvader(evader_2, { x: 400, y: 600 });
        world.spawnEvader(evader_3, { x: 400, y: 700 });
        world.spawnPursuer(pursuer_1, { x: 600, y: 500 });
        world.spawnPursuer(pursuer_2, { x: 600, y: 600 });

        return world;
    }
}