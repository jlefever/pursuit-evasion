import ITerrainPoint from "./ITerrainPoint";
import ISquare from "../geometry/ISquare";

export default class TerrainPoint implements ITerrainPoint {
    public readonly i: number;
    public readonly j: number;
    public readonly bounds: ISquare;
    public isObstacle: boolean = false;

    private constructor(i: number, j: number, bounds: ISquare) {
        this.i = i;
        this.j = j;
        this.bounds = bounds;
    }

    public static create(i: number, j: number, bounds: ISquare) {
        return new TerrainPoint(i, j, bounds);
    }

    public reset = () => this.isObstacle = false;
}