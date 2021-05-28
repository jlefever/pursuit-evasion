import { h, Component, createRef, RefObject } from "preact";
import GameLoop from "../../pe/GameLoop";
import { Board } from "../../pe/model"

interface Game2Props {
    width: number;
    height: number;
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
    board: Board;
    context: CanvasRenderingContext2D | null;
    gameLoop: GameLoop;
    timerId?: any;

    constructor(props: Game2Props) {
        super(props);
        this.ref = createRef();
        this.board = new Board(this.props.width, this.props.height);
        this.context = null;
        this.state = { value: "", fps: 0, ups: 0 };

        this.gameLoop = new GameLoop(this.board.update, (alpha) => {
            if (!this.context) return;
            this.board.draw(this.context, alpha);
        }, this.props.desiredUps);
    }

    componentDidMount() {
        console.log("mount");
        this.context = this.ref.current!.getContext("2d");
        this.gameLoop.playing = this.props.playing;
        this.timerId = setInterval(() => {
            this.setState({
                fps: this.gameLoop.framesPerSecond,
                ups: this.gameLoop.updatesPerSecond
            });
        }, 1000);
    }

    componentWillUnmount() {
        this.gameLoop.pause();
        clearInterval(this.timerId);
    }

    componentDidUpdate(prevProps: Game2Props, prevState: Game2State, snapshot: any) {
        this.context = this.ref.current!.getContext("2d");
        this.gameLoop.playing = this.props.playing;
        this.gameLoop.targetUps = this.props.desiredUps;
    }

    render() {
        const round = (num: number) => Math.round(num * 1000) / 1000;

        const { width, height } = this.props;
        return <div>
            <canvas ref={this.ref} width={width} height={height}></canvas>
            <span class="pr-3 is-family-monospace">FPS: {round(this.state.fps)}</span>
            <span class="is-family-monospace">TPS: {round(this.state.ups)}</span>
        </div>
    }
}

export default Game2;