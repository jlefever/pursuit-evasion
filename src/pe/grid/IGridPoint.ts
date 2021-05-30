/**
 * Represents a point on a discrete two dimensional grid. The components `i`
 * and `j` may be positive or negative but must be integers. If an IGridPoint
 * has any additional state, it must be reset to defaults when `reset()` is
 * invoked.
 */
export default interface IGridPoint {
    /**
     * The horizontal component of the point. (Assumed to be an integer.)
     */
    readonly i: number;

    /**
     * The verticle component of the point. (Assumed to be an integer.)
     */
    readonly j: number;

    /**
     * (Optional.) Reset any state of this point to default values, except for
     * `i` and `j`.
     */
    readonly reset?: () => void;
}