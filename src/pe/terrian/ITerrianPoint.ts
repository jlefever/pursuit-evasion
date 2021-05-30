import IMeshPoint from "../grid/IMeshPoint";

export default interface ITerrianPoint extends IMeshPoint {
    readonly isObstacle: boolean;
}