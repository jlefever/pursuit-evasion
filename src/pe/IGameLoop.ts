export default interface IGameLoop {
    /**
     * The measured frames per second.
     */
    readonly frameRate: number;

    /**
     * The measured ticks per second.
     */
    readonly tickRate: number;

    /**
     * The desired tick rate. (Mutable.)
     */
    targetTickRate: number;

    /**
     * Boolean representing if the game (both rendering and updating) is
     * currently playing. Assign true or false to play or pause.
     */
    isPlaying: boolean;

    /**
     * Ensure game is playing.
     */
    play: () => void;

    /**
     * Ensure game is paused.
     */
    pause: () => void;
}