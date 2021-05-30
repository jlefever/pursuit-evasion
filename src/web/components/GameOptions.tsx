import { h, FunctionalComponent } from "preact";
import PlayButton from "./PlayButton";
import Slider from "./Slider";

interface GameOptionsProps {
    isPlaying: boolean;
    targetTickRate: number;
    topEvaderSpeed: number;
    topPursuerSpeed: number;
    captureDistance: number;
    maxGameLength: number;

    setIsPlaying: (value: boolean) => void;
    setTargetTickRate: (value: number) => void;
    setTopEvaderSpeed: (value: number) => void;
    setTopPursuerSpeed: (value: number) => void;
    setCaptureDistance: (value: number) => void;
    setMaxGameLength: (value: number) => void;
    resetToDefaults: () => void;
}

const comp: FunctionalComponent<GameOptionsProps> = (props: GameOptionsProps) => {
    return <nav class="panel">
        <p class="panel-heading">Simulation</p>
        <div class="panel-block">
            <p class="control is-expanded">
                <PlayButton isPlaying={props.isPlaying} setIsPlaying={props.setIsPlaying} />
            </p>
        </div>
        <div class="panel-block">
            <div style="width: 100%">
                <div class="field">
                    <label class="label has-text-weight-light">Target Tick Rate</label>
                    <Slider value={props.targetTickRate} setValue={props.setTargetTickRate} min={0} max={500} step={1} />
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div style="width: 100%">
                <div class="field">
                    <label class="label has-text-weight-light">Top Evader Speed</label>
                    <Slider value={props.topEvaderSpeed} setValue={props.setTopEvaderSpeed} min={0} max={100} step={1} />
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div style="width: 100%">
                <div class="field">
                    <label class="label has-text-weight-light">Top Pursuer Speed</label>
                    <Slider value={props.topPursuerSpeed} setValue={props.setTopPursuerSpeed} min={0} max={100} step={1} />
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div style="width: 100%">
                <div class="field">
                    <label class="label has-text-weight-light">Capture Distance</label>
                    <Slider value={props.captureDistance} setValue={props.setCaptureDistance} min={0} max={100} step={1} />
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div style="width: 100%">
                <div class="field">
                    <label class="label has-text-weight-light">Max Game Length</label>
                    <Slider value={props.maxGameLength} setValue={props.setMaxGameLength} min={0} max={4000} step={1} />
                </div>
            </div>
        </div>
        <div class="panel-block">
            <button
                onClick={_ => props.resetToDefaults()}
                class="button is-link is-outlined is-fullwidth">
                Reset to Defaults
                </button>
        </div>
    </nav>;
}

export default comp;