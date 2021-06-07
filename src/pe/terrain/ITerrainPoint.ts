import IMeshPoint from "../grid/IMeshPoint";

export default interface ITerrainPoint extends IMeshPoint {
    readonly isObstacle: boolean;
}