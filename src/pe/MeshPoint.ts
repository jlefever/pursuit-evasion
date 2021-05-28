export default interface MeshPoint {
    readonly i: number;
    readonly j: number;
    
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;

    reset: () => void;
}