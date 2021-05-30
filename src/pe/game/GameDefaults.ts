import RandomAgent from "../agency/RandomAgent";
import Terrian from "../terrian/Terrian";
import GameWorld from "./GameWorld";
import Physics from "./Physics";

export default class GameDefaults {
    public static TOP_EVADER_SPEED = 8;
    public static TOP_PURSUER_SPEED = 8;
    public static CAPTURE_DISTANCE = 2;
    public static MAX_GAME_LENGTH = 600;

    public static createDefaultWorld(terrian: Terrian) {
        const world = new GameWorld(terrian, new Physics(terrian));

        // Set obstacles
        terrian.setObstacles([5, 5], [5, 6], [6, 6]);

        // Add agents
        world.spawnEvader(new RandomAgent(), { x: 100, y: 100 });
        world.spawnEvader(new RandomAgent(), { x: 100, y: 200 });
        world.spawnPursuer(new RandomAgent(), { x: 500, y: 500 });
        
        return world;
    }
}