import { h, JSX } from "preact";

interface GridProps {
    width: number;
    height: number;
    hCells: number;
    vCells: number;
};

function line(x1: number, y1: number, x2: number, y2: number): JSX.Element {
    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#BDBDBD" stroke-width="1" />;
}

function Grid(props: GridProps) {
    const { width, height, hCells, vCells } = props;
    const cellW = width / hCells;
    const cellH = height / vCells;

    const lines: JSX.Element[] = [];

    for (let i = 1; i < hCells; i++) {
        const lineX = i * cellW;
        lines.push(line(lineX, 0, lineX, height));
    }

    for (let i = 1; i < vCells; i++) {
        const lineY = i * cellH;
        lines.push(line(0, lineY, width, lineY));
    }

    return <g>{lines}</g>;
}

export default Grid;