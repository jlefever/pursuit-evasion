import { h, Component } from "preact";
import Circle from "./circle";
import Sizer from "./sizer";
import Grid from "./grid";

interface GameState {
    width: number;
    height: number;
}

class Game extends Component<{}, GameState> {
    constructor() {
        super();
        this.state = { width: 0, height: 600 };
    }

    setSize = (width: number, height: number) => {
        this.setState({ width, height });
    }

    render() {
        const { width, height } = this.state;
        return (<Sizer setSize={this.setSize}>
            <svg id="my-svg" width="100%" height={height}>
                <Grid width={width} height={height} hCells={12} vCells={9} />
                <Circle cx={400} cy={300} r={20} />
            </svg>
        </Sizer>)
    }
}

export default Game;