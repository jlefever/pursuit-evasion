import IMeshPoint from "./IMeshPoint";

export default interface IEnvironmentPoint extends IMeshPoint {
    readonly isObstacle: boolean;
}