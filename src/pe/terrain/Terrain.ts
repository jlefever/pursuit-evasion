import ArrayMesh from "../grid/ArrayMesh";
import IMesh from "../grid/IMesh";
import ITerrain from "./ITerrain";
import TerrainPoint from "./TerrainPoint";

export default class Terrain implements ITerrain {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _numHCells: number;
    private readonly _numVCells: number;
    private readonly _cellSize: number;
    private readonly _mesh: IMesh<TerrainPoint>;
    private readonly _maxI: number;
    private readonly _maxJ: number;
    public _obstacleCells: Array<[number,number]>;

    public constructor(numHCells: number, numVCells: number, width: number) {
        this._numHCells = numHCells;
        this._numVCells = numVCells;
        this._cellSize = (width / numHCells) | 0;
        this._width = width;
        this._height = this._cellSize * numVCells;
        this._mesh = new ArrayMesh(TerrainPoint.create, this._cellSize);
        this._maxI = this._mesh.getI(width);
        this._maxJ = this._mesh.getJ(this._height);
        this._obstacleCells = [];
    }

    public get width() {
        return this._width;
    }
    
    public get obstacleCells () {
        return this._obstacleCells;
    }

    public get height() {
        return this._height;
    }

    public get cellSize() {
        return this._cellSize;
    }

    public get numHCells() {
        return this._numHCells;
    }

    public get numVCells() {
        return this._numVCells;
    }

    public get mesh() {
        return this._mesh;
    }

    public isLegalPoint = (x: number, y: number) => {
        return this.isLegalCell(this._mesh.getI(x), this._mesh.getJ(y));
    }

    public isLegalCell = (i: number, j: number) => {
        if (i < 0 || j < 0 || i > this._maxI || j > this._maxJ) {
            return false;
        }

        return !this._mesh.getOrCreate(i, j).isObstacle;
    }

    public setObstacles = (...locations: [number, number][]) => {
        this._mesh.reset();
        locations.forEach(loc => {
            const [i, j] = loc;
            this._mesh.getOrCreate(i, j).isObstacle = true;
            this._obstacleCells.push([i,j]);
        });
    }
}