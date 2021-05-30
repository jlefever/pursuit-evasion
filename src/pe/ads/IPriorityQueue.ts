export default interface IPriorityQueue<T> {
    readonly isEmpty: () => boolean;
    readonly pop: () => T | undefined;
    readonly push: (...eles: T[]) => void;
}