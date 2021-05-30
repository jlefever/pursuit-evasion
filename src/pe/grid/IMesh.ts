import IGrid from "./IGrid";
import IMeshPoint from "./IMeshPoint";
import ISquare from "../geometry/ISquare";

/**
 * Maps a continuous two dimensional plane to a discrete integer grid.
 */
export default interface IMesh<T extends IMeshPoint> extends IGrid<T> {
    /**
     * The width and height of a square region of continous space which is
     * mapped to a single mesh point.
     */
    readonly stepSize: number;

    /**
     * Get the horizontal (integer) index for a given (floating point) `x` value.
     */
    readonly getI: (x: number) => number;

    /**
     * Get the vertical (integer) index for a given (floating point) `y` value.
     */
    readonly getJ: (y: number) => number;

    /**
     * Get the minimal x value which is mapped to the given index. So index `i`
     * represents the interval [x, stepSize) along the horizontal.
     */
    readonly getX: (i: number) => number;

    /**
     * Get the minimal y value which is mapped to the given index. So index `j`
     * represents the interval [y, stepSize) along the vertical.
     */
    readonly getY: (j: number) => number;

    /**
     * Get the bounding region for the given indices.
     */
    readonly getBounds: (i: number, j: number) => ISquare;
}