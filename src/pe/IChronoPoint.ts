import IMeshPoint from "./IMeshPoint";

export default interface IChronoPoint extends IMeshPoint {
    /**
     * The time-to-reach this point.
     */
    readonly ttr: number;
}