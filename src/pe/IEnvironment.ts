import IEnvironmentPoint from "./IEnvironmentPoint";
import IMesh from "./IMesh";

export default interface IEnvironment {
    readonly mesh: IMesh<IEnvironmentPoint>;
    readonly width: number;
    readonly height: number;
    readonly numHCells: number;
    readonly numVCells: number;
    readonly cellSize: number;
    readonly isLegalCell: (i: number, j: number) => boolean;
    readonly isLegalPoint: (x: number, j: number) => boolean;
}