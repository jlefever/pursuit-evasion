import { h, FunctionalComponent } from 'preact';
import { ElkEdgeSection, ElkExtendedEdge } from 'elkjs/lib/elk-api';
import { ElkShape } from 'elkjs/lib/elk.bundled';


import style from "./style.css";
import TextNode from './textNode';


const Edge: FunctionalComponent<ElkExtendedEdge> = (props) => {
    const { sections, labels } = props;

    if (!sections || sections.length === 0) {
        return <g></g>;
    }

    const last = sections.slice(-1, 1)[0]
    const { x: x0, y: y0 } = last.startPoint;
    const { x: x1, y: y1 } = last.endPoint;

    const angle = Math.atan2(y0 - y1, x0 - x1) * 180 / Math.PI;

    return <g class={style["sprotty-edge"]}>
        <path d={toPath(sections)} />
        <path
            class={style["arrow"]}
            d="M -1.5,0 L 10,-4 L 10,4 Z"
            transform={`rotate(${angle} ${x1} ${y1}) translate(${x1} ${y1})`}></path>
    </g>;
}

function toPath(sections?: ElkEdgeSection[]): string {
    if (!sections || sections.length === 0) return "";

    const head = sections.slice(0, 1)[0];
    const { x: x0, y: y0 } = head.startPoint;
    const { x: x1, y: y1 } = head.endPoint;
    const init = `M ${x0} ${y0} L ${x1} ${y1} `

    return init + sections.slice(1).map(s => {
        const { x: x0, y: y0 } = s.startPoint;
        const { x: x1, y: y1 } = s.endPoint;
        return `L ${x0} ${y0} L ${x1} ${y1}`
    }).join(" ");
}

export default Edge;