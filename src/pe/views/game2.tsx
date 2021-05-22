import { h, Component, createRef, RefObject, Fragment } from "preact";
import { Board } from "../model"

interface Game2Props {
    width: number;
    height: number;
}

interface Game2State {
    value: string;
}

const UPDATES_PER_SECOND = 1000 / 60;

class Game2 extends Component<Game2Props, Game2State> {
    ref: RefObject<HTMLCanvasElement>;
    board: Board;
    lastUpdate: number;

    constructor(props: Game2Props) {
        super(props);
        this.ref = createRef();
        this.board = new Board(this.props.width, this.props.height);
        this.lastUpdate = 0;
        this.mainLoop = this.mainLoop.bind(this);
        this.state = { value: "" };
    }

    componentDidMount() {
        this.lastUpdate = performance.now();
        this.mainLoop();
    }

    mainLoop() {
        window.requestAnimationFrame(this.mainLoop);
        const ctx = this.ref.current!.getContext("2d")!;
        this.board.draw(ctx);
        this.board.update();

        // this.setState({ value: JSON.stringify(this.board.agents, null, 2) });

        // this.setState({ value: JSON.stringify(this.board.agents[0].getDirection(), null, 2) });

        // const elapsed = performance.now() - this.lastUpdate;

        // if (elapsed > UPDATES_PER_SECOND) {
        //     this.setState({ value: JSON.stringify(this.board.agents[0], null, 2) });
        //     this.board.update();
        //     this.lastUpdate = performance.now() - (elapsed % UPDATES_PER_SECOND);
        // }
    }

    render() {
        const { width, height } = this.props;
        return <>
            <canvas ref={this.ref} width={width} height={height}></canvas>
            <pre>{this.state.value}</pre>
        </>
    }
}

export default Game2;