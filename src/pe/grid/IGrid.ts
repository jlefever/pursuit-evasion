import IGridPoint from "./IGridPoint";

export default interface IGrid<T extends IGridPoint> {
    /**
     * Return the point at the given position. If this is the first time
     * accessing this point, a new point object will be created and its
     * reference returned. Otherwise, the already existing point object will
     * be returned.
     */
    readonly getOrCreate: (i: number, j: number) => T;

    /**
     * Call the given `callback` function on each existing point in the grid.
     * (The point must have been accessed at least once for it to exist.)
     */
    readonly forEach: (callback: (point: T) => void) => void;

    /**
     * Reset all grid points to default values.
     */
    readonly reset: () => void;
}