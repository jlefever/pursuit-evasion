import { h, Component, createRef, RefObject } from "preact";
import Terrain from "../../pe/terrain/Terrain";
import GameLoop from "../../pe/game/GameLoop";
import GameWorld from "../../pe/game/GameWorld";
import Renderer from "../../pe/rendering/Renderer";
import Victory from "../../pe/game/Victory";
import GameDefaults from "../../pe/game/GameDefaults";
import IRenderer from "../../pe/rendering/IRenderer";

interface GameWindowProps {
    // Once set, changing these values will do nothing.
    width: number;
    numHCells: number;
    numVCells: number;

    // These values can be adjusted at any time.
    isPlaying: boolean;
    targetTickRate: number;
    topEvaderSpeed: number;
    topPursuerSpeed: number;
    captureDistance: number;
    maxGameLength: number;
    victory?: Victory;
    showChronoMap: boolean

    // This is called when a winner is found.
    victorFound: (victory: Victory) => void;
}

interface GameWindowState {
    frameRate: number;
    tickRate: number;
}

export default class GameWindow extends Component<GameWindowProps, GameWindowState> {
    private _ref: RefObject<HTMLCanvasElement>;
    private _terrain: Terrain;
    private _ctx: CanvasRenderingContext2D | null;
    private _gameLoop: GameLoop;
    private _gameWorld: GameWorld;
    private _renderer: IRenderer;
    private _timerId?: any;

    constructor(props: GameWindowProps) {
        super(props);
        this._ref = createRef();
        this._ctx = null;
        this.state = { frameRate: 0, tickRate: 0 };

        const terrain = new Terrain(props.numHCells, props.numVCells, props.width);
        const world = GameDefaults.createDefaultWorld(terrain);
        const renderer = new Renderer(world);

        this._renderer = renderer;
        this._terrain = terrain;
        this._gameWorld = world;
        this._gameLoop = new GameLoop(world.update, (alpha) => {
            if (!this._ctx) return;
            renderer.render(this._ctx, alpha);
        }, this.props.targetTickRate);
    }

    componentDidMount() {
        this.refresh();

        // Do one render just so something is on the screen, even when paused.
        this._renderer.render(this._ctx!, 0);

        // Update our display of these values once a second
        this._timerId = setInterval(() => {
            this.setState({
                frameRate: this._gameLoop.frameRate,
                tickRate: this._gameLoop.tickRate
            });
        }, 1000);
    }

    componentWillUnmount() {
        this._gameLoop.pause();
        clearInterval(this._timerId);
    }

    componentDidUpdate() {
        this.refresh();
    }

    refresh = () => {
        this._ctx = this._ref.current!.getContext("2d");
        this._gameLoop.isPlaying = this.props.isPlaying;
        this._gameLoop.targetTickRate = this.props.targetTickRate;
        this._gameWorld.topEvaderSpeed = this.props.topEvaderSpeed;
        this._gameWorld.topPursuerSpeed = this.props.topPursuerSpeed;
        this._gameWorld.captureDistance = this.props.captureDistance;
        this._gameWorld.maxGameLength = this.props.maxGameLength;
        this._gameWorld.victoryCallback = this.props.victorFound;
        this._gameWorld.isUpdatingChronoMap = this.props.showChronoMap;
    }

    render() {
        const round = (num: number) => Math.round(num * 1000) / 1000;

        const { width, height } = this._terrain;
        return <div>
            <canvas ref={this._ref} width={width} height={height}></canvas>
            <span class="pr-3 is-family-monospace">Frame Rate: {round(this.state.frameRate)}</span>
            <span class="pr-3 is-family-monospace">Tick Rate: {round(this.state.tickRate)}</span>
        </div>
    }
}
