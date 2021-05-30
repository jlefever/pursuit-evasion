export default interface IDrivable {
    readonly steerTo: (angle: number) => void;
    readonly break: () => void;
    readonly gas: () => void;
}