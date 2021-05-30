import { h, FunctionalComponent } from "preact";

interface PlayButtonProps {
    isPlaying: boolean;
    setIsPlaying: (value: boolean) => void;
}

const comp: FunctionalComponent<PlayButtonProps> = (props: PlayButtonProps) => {
    const { isPlaying, setIsPlaying } = props;
    return <button
        class="button is-fullwidth is-outlined is-link"
        onClick={_ => setIsPlaying(!isPlaying)}>
        <span class="icon">
            {isPlaying ? <i class="fas fa-pause" /> : <i class="fas fa-play" />}
        </span>
    </button>
};

export default comp;