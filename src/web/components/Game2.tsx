import { h, Component, createRef, RefObject } from "preact";
import Terrian from "../../pe/terrian/Terrian";
import GameLoop from "../../pe/game/GameLoop";
import GameWorld from "../../pe/game/GameWorld";
import ITerrian from "../../pe/terrian/ITerrian";
import RandomAgent from "../../pe/agency/RandomAgent";
import Renderer from "../../pe/rendering/Renderer";
import Physics from "../../pe/game/Physics";

interface Game2Props {
    width: number;
    numHCells: number;
    numVCells: number;
    playing: boolean;
    desiredUps: number;
}

interface Game2State {
    value: string;
    fps: number;
    ups: number;
}

class Game2 extends Component<Game2Props, Game2State> {
    ref: RefObject<HTMLCanvasElement>;
    terrian: ITerrian;
    context: CanvasRenderingContext2D | null;
    gameLoop: GameLoop;
    timerId?: any;

    constructor(props: Game2Props) {
        super(props);
        this.ref = createRef();

        const terrian = new Terrian(props.numHCells, props.numVCells, props.width);
        terrian.setObstacles([5, 5], [5, 6], [6, 6]);
        this.terrian = terrian;
        const world = new GameWorld(this.terrian, new Physics(terrian));
        world.spawnEvader(new RandomAgent(), { x: 100, y: 100 });
        world.spawnEvader(new RandomAgent(), { x: 100, y: 200 });
        world.spawnPursuer(new RandomAgent(), { x: 500, y: 500 });
        const renderer = new Renderer(world);

        this.context = null;
        this.state = { value: "", fps: 0, ups: 0 };

        this.gameLoop = new GameLoop(world.update, (alpha) => {
            if (!this.context) return;
            renderer.render(this.context, alpha);
        }, this.props.desiredUps);
    }

    componentDidMount() {
        console.log("mount");
        this.context = this.ref.current!.getContext("2d");
        this.gameLoop.isPlaying = this.props.playing;
        this.timerId = setInterval(() => {
            this.setState({
                fps: this.gameLoop.frameRate,
                ups: this.gameLoop.tickRate
            });
        }, 1000);
    }

    componentWillUnmount() {
        this.gameLoop.pause();
        clearInterval(this.timerId);
    }

    componentDidUpdate(prevProps: Game2Props, prevState: Game2State, snapshot: any) {
        this.context = this.ref.current!.getContext("2d");
        this.gameLoop.isPlaying = this.props.playing;
        this.gameLoop.targetTickRate = this.props.desiredUps;
    }

    render() {
        const round = (num: number) => Math.round(num * 1000) / 1000;

        const { width, height } = this.terrian;
        return <div>
            <canvas ref={this.ref} width={width} height={height}></canvas>
            <span class="pr-3 is-family-monospace">FPS: {round(this.state.fps)}</span>
            <span class="is-family-monospace">TPS: {round(this.state.ups)}</span>
        </div>
    }
}

export default Game2;