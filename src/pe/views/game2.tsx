import { h, Component, createRef, RefObject } from "preact";
import { Board } from "../model"

interface Game2Props {
    width: number;
    height: number;
}

const UPDATES_PER_SECOND = 1000 / 60;

class Game2 extends Component<Game2Props, {}> {
    ref: RefObject<HTMLCanvasElement>;
    board: Board;
    lastUpdate: number;

    constructor(props: Game2Props) {
        super(props);
        this.ref = createRef();
        this.board = new Board(this.props.width, this.props.height);
        this.lastUpdate = 0;
        this.mainLoop = this.mainLoop.bind(this);
    }

    componentDidMount() {
        this.lastUpdate = performance.now();
        this.mainLoop();
    }

    mainLoop() {
        window.requestAnimationFrame(this.mainLoop);
        const ctx = this.ref.current!.getContext("2d")!;
        this.board.draw(ctx);

        const elapsed = performance.now() - this.lastUpdate;

        if (elapsed > UPDATES_PER_SECOND) {
            this.board.update();
            this.lastUpdate = performance.now() - (elapsed % UPDATES_PER_SECOND);
        }
    }

    render() {
        const { width, height } = this.props;
        return <canvas ref={this.ref} width={width} height={height}></canvas>;
    }
}

export default Game2;