import IPoint from "./IPoint";

export default interface ISquare {
    /**
     * The top left corner of this square.
     */
    readonly origin: IPoint;

    /**
     * The width and height of this square.
     */
    readonly size: number;
}