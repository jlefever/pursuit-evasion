import IGridPoint from "./IGridPoint";
import ISquare from "../geometry/ISquare";

export default interface IMeshPoint extends IGridPoint {
    /**
     * The region of the Euclidian plane this mesh point represents.
     */
    readonly bounds: ISquare;
}