import ITerrianPoint from "./ITerrianPoint";
import IMesh from "../grid/IMesh";

export default interface ITerrian {
    readonly mesh: IMesh<ITerrianPoint>;
    readonly width: number;
    readonly height: number;
    readonly numHCells: number;
    readonly numVCells: number;
    readonly cellSize: number;
    readonly isLegalCell: (i: number, j: number) => boolean;
    readonly isLegalPoint: (x: number, y: number) => boolean;
}