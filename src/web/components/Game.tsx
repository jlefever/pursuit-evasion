import { h, Component, createRef, RefObject } from "preact";
import GameDefaults from "../../pe/game/GameDefaults";
import GameOptions from "./GameOptions";
import GameWindow from "./GameWindow";

interface GameState {
    isPlaying: boolean;
    targetTickRate: number;
    topEvaderSpeed: number;
    topPursuerSpeed: number;
    captureDistance: number;
    maxGameLength: number;
}

const DEFAULT_STATE = {
    targetTickRate: 40,
    topEvaderSpeed: GameDefaults.TOP_EVADER_SPEED,
    topPursuerSpeed: GameDefaults.TOP_PURSUER_SPEED,
    captureDistance: GameDefaults.CAPTURE_DISTANCE,
    maxGameLength: GameDefaults.MAX_GAME_LENGTH
};

export default class Game extends Component<{}, GameState> {
    constructor(props: {}) {
        super(props);
        this.state = { isPlaying: false, ...DEFAULT_STATE };
    }

    private resetToDefaults = () => {
        this.setState(DEFAULT_STATE);
    }

    private setIsPlaying = (value: boolean) => {
        this.setState({ isPlaying: value });
    }

    private setTargetTickRate = (value: number) => {
        this.setState({ targetTickRate: value });
    }

    private setTopEvaderSpeed = (value: number) => {
        this.setState({ topEvaderSpeed: value });
    }

    private setTopPursuerSpeed = (value: number) => {
        this.setState({ topPursuerSpeed: value });
    }

    private setCaptureDistance = (value: number) => {
        this.setState({ captureDistance: value });
    }

    private setMaxGameLength = (value: number) => {
        this.setState({ maxGameLength: value });
    }

    public render() {
        const {
            isPlaying,
            targetTickRate,
            topEvaderSpeed,
            topPursuerSpeed,
            captureDistance,
            maxGameLength
        } = this.state;

        return <div class="columns">
            <div class="column is-three-quarters">
                <div class="box">
                    <GameWindow
                        width={962}
                        numHCells={26}
                        numVCells={26}
                        isPlaying={isPlaying}
                        targetTickRate={targetTickRate}
                        topEvaderSpeed={topEvaderSpeed}
                        topPursuerSpeed={topPursuerSpeed}
                        captureDistance={captureDistance}
                        maxGameLength={maxGameLength}
                    />
                </div>
            </div>
            <div class="column">
                <GameOptions
                    isPlaying={isPlaying}
                    targetTickRate={targetTickRate}
                    topEvaderSpeed={topEvaderSpeed}
                    topPursuerSpeed={topPursuerSpeed}
                    captureDistance={captureDistance}
                    maxGameLength={maxGameLength}

                    setIsPlaying={this.setIsPlaying}
                    setTargetTickRate={this.setTargetTickRate}
                    setTopEvaderSpeed={this.setTopEvaderSpeed}
                    setTopPursuerSpeed={this.setTopPursuerSpeed}
                    setCaptureDistance={this.setCaptureDistance}
                    setMaxGameLength={this.setMaxGameLength}
                    resetToDefaults={this.resetToDefaults}
                />
            </div>
        </div>
    }
}