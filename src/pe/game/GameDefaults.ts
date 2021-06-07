import GreedyChronoAgent from "../agency/GreedyChronoAgent";
import KeyboardInputAgent from "../agency/KeyboardInputAgent";
import DQNAgent from "../agency/DQNAgent";
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
        boundaryArr.push([0,0]);
        boundaryArr.push([terrain.numHCells-1,0]);
        boundaryArr.push([0,terrain.numVCells-1]);
        boundaryArr.push([terrain.numHCells-1,terrain.numVCells-1]);
        for (let i = 1; i < terrain.numHCells - 1; i++) {
            boundaryArr.push([i,0]);
            boundaryArr.push([i,terrain.numVCells-1]);
        }
        for (let i = 1; i < terrain.numVCells - 1; i++) {
            boundaryArr.push([0,i]);
            boundaryArr.push([terrain.numHCells - 1,i]);
        }
        const allObstacles: Array<[number, number]> = [[13, 3], [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9],
        [13, 10], [13, 14], [13, 15], [13, 16], [13, 17], [13, 18], [13, 19],
        [13, 20], [13, 21], [13, 22], [26, 3], [26, 4], [26, 5], [26, 6], [26, 7], [26, 8], [26, 9],
        [26, 10], [26, 14], [26, 15], [26, 16], [26, 17], [26, 18], [26, 19],
        [26, 20], [26, 21], [26, 22], ...boundaryArr];
        terrain.setObstacles(...allObstacles);

        // Add agents
        const evader_1 = new RunawayAgent();
        const evader_2 = new RunawayAgent();
        const evader_3 = new RunawayAgent();
        const evader_4 = new RunawayAgent();
        const evader_5 = new RunawayAgent();
        // const pursuer_1 = new RandomAgent();
        // const pursuer_2 = new RandomAgent();
        // const pursuer_3 = new RandomAgent();
        const pursuer_1 = new DQNAgent();
        const pursuer_2 = new DQNAgent();
        const pursuer_3 = new DQNAgent();

        // world.spawnPursuer(new GreedyChronoAgent(terrain), { x: 700, y: 500 });

        // world.spawnEvader(evader_1, { x: 400, y: 200 });
        // world.spawnEvader(evader_2, { x: 400, y: 500 });
        // world.spawnEvader(evader_3, { x: 400, y: 800 });
        // world.spawnPursuer(pursuer_1, { x: 1200, y: 200 });
        // world.spawnPursuer(pursuer_2, { x: 1200, y: 500 });
        // world.spawnPursuer(pursuer_3, { x: 1200, y: 800 });

        world.spawnEvader(evader_1, { x: 400, y: 200 });
        world.spawnEvader(evader_2, { x: 400, y: 500 });
        world.spawnEvader(evader_3, { x: 400, y: 800 });
        world.spawnEvader(evader_4, { x: 200, y: 350 });
        world.spawnEvader(evader_5, { x: 200, y: 650 });
        world.spawnPursuer(pursuer_1, { x: 1200, y: 200 });
        world.spawnPursuer(pursuer_2, { x: 1200, y: 500 });
        world.spawnPursuer(pursuer_3, { x: 1200, y: 800 });


        return world;
    }
}