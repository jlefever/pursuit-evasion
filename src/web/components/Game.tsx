import { h, Component, createRef, RefObject } from "preact";
import GameDefaults from "../../pe/game/GameDefaults";
import Victory from "../../pe/game/Victory";
import GameOptions from "./GameOptions";
import GameWindow from "./GameWindow";

interface GameState {
    isPlaying: boolean;
    targetTickRate: number;
    topEvaderSpeed: number;
    topPursuerSpeed: number;
    captureDistance: number;
    maxGameLength: number;
    victory?: Victory;
    showChronoMap: boolean;
}

const DEFAULT_STATE = {
    targetTickRate: 20,
    topEvaderSpeed: GameDefaults.TOP_EVADER_SPEED,
    topPursuerSpeed: GameDefaults.TOP_PURSUER_SPEED,
    captureDistance: GameDefaults.CAPTURE_DISTANCE,
    maxGameLength: GameDefaults.MAX_GAME_LENGTH,
    victory: undefined,
    showChronoMap: true
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

    private victorFound = (value: Victory) => {
        this.setState({ victory: value });

        // Just pause the game when a winner is found.
        this.setIsPlaying(false);
    }

    private setShowChronoMap = (value: boolean) => {
        this.setState({ showChronoMap: value });
    }

    public render() {
        const {
            isPlaying,
            targetTickRate,
            topEvaderSpeed,
            topPursuerSpeed,
            captureDistance,
            maxGameLength,
            showChronoMap
        } = this.state;

        return <div class="columns">
            <div class="column is-four-fifths">
                <div class="box">
                    <GameWindow
                        width={1515}
                        numHCells={40}
                        numVCells={26}
                        isPlaying={isPlaying}
                        targetTickRate={targetTickRate}
                        topEvaderSpeed={topEvaderSpeed}
                        topPursuerSpeed={topPursuerSpeed}
                        captureDistance={captureDistance}
                        maxGameLength={maxGameLength}
                        victorFound={this.victorFound}
                        showChronoMap={showChronoMap}
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
                    showChronoMap={showChronoMap}

                    setIsPlaying={this.setIsPlaying}
                    setTargetTickRate={this.setTargetTickRate}
                    setTopEvaderSpeed={this.setTopEvaderSpeed}
                    setTopPursuerSpeed={this.setTopPursuerSpeed}
                    setCaptureDistance={this.setCaptureDistance}
                    setMaxGameLength={this.setMaxGameLength}
                    resetToDefaults={this.resetToDefaults}
                    setShowChronoMap={this.setShowChronoMap}
                />
            </div>
        </div>
    }
}