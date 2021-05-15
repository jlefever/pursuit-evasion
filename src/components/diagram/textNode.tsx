import { ElkShape } from "elkjs/lib/elk-api";
import { h } from "preact";

import Sizer from "./sizer";

import style from "./style.css";

interface TextNodeProps extends ElkShape {
    text: string
    setSize?: (width: number, height: number) => void;
};

function TextNode(props: TextNodeProps) {
    function setSize(width: number, height: number) {
        props.setSize && props.setSize(10 + width, 10 + height);
    }

    const { text, x, y, width, height } = props;

    return (<g transform={`translate(${x}, ${y})`}>
        <rect class={style["sprotty-node"]} rx="5" width={width} height={height} />
        <Sizer setSize={setSize}>
            <text
                class={style["sprotty-label"]}
                transform={`translate(5, ${height ? (height - 10) / 2 : 0})`}
                >
                {text}
            </text>
        </Sizer>
    </g>);
}

export default TextNode;