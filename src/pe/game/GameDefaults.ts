import GreedyChronoAgent from "../agency/GreedyChronoAgent";
import KeyboardInputAgent from "../agency/KeyboardInputAgent";
import RandomAgent from "../agency/RandomAgent";
import Terrian from "../terrian/Terrian";
import GameWorld from "./GameWorld";
import Physics from "./Physics";

export default class GameDefaults {
    public static TOP_EVADER_SPEED = 8;
    public static TOP_PURSUER_SPEED = 8;
    public static CAPTURE_DISTANCE = 10;
    public static MAX_GAME_LENGTH = 600;

    public static createDefaultWorld(terrian: Terrian) {
        const world = new GameWorld(terrian, new Physics(terrian));

        // Set obstacles
        // const arr: Array<[number, number]> = [];
        // for (let i = 5; i <= terrian.numVCells - 5; i++) {
        //     arr.push([13, i]);
        // }
        // terrian.setObstacles(...arr);

        terrian.setObstacles(
            [13, 3], [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9],
            [13, 10], [13, 14], [13, 15], [13, 16], [13, 17], [13, 18], [13, 19],
            [13, 20], [13, 21], [13, 22]);

        // Add agents
        world.spawnEvader(new RandomAgent(), { x: 100, y: 100 });
        world.spawnEvader(new RandomAgent(), { x: 100, y: 200 });
        world.spawnEvader(new RandomAgent(), { x: 100, y: 200 });
        world.spawnPursuer(new RandomAgent(), { x: 100, y: 200 });
        world.spawnPursuer(new KeyboardInputAgent(), { x: 100, y: 200 });
        // world.spawnPursuer(new GreedyChronoAgent(terrian), { x: 700, y: 500 });

        return world;
    }
}