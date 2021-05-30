import IRenderer from "./IRenderer";
import IRenderingContext from "./IRenderingContext";

const GRID_LINE_WIDTH = 0.75;
const GRID_LINE_COLOR = "#BDBDBD"

export default class GridLinesRenderer implements IRenderer {
    private _numHCells: number;
    private _numVCells: number;
    private _cellSize: number;
    private _width: number;
    private _height: number;

    public constructor(numHCells: number, numVCells: number, cellSize: number) {
        this._numHCells = numHCells;
        this._numVCells = numVCells;
        this._cellSize = cellSize;
        this._width = numHCells * cellSize;
        this._height = numVCells * cellSize;
    }
    
    public render = (ctx: IRenderingContext, alpha: number) => {
        ctx.lineWidth = GRID_LINE_WIDTH;
        ctx.strokeStyle = GRID_LINE_COLOR;

        for (let i = 0; i <= this._numHCells; i++) {
            const x = i * this._cellSize;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this._height);
        }

        for (let i = 0; i <= this._numVCells; i++) {
            const y = i * this._cellSize;
            ctx.moveTo(y, 0);
            ctx.lineTo(y, this._width);
        }
    }
}