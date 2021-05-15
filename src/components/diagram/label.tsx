import { ElkLabel } from "elkjs/lib/elk-api";
import { h } from "preact";

import Sizer from "./sizer";

import style from "./style.css";

interface LabelProps extends ElkLabel {
    setSize?: (width: number, height: number) => void;
};

function Label(props: LabelProps) {
    function setSize(width: number, height: number) {
        props.setSize && props.setSize(width, height);
    }

    const { text, x, y, width, height } = props;

    return (<g transform={`translate(${x}, ${y})`}>
        <Sizer setSize={setSize}>
            <text
                class={style["sprotty-label"]}
                transform={`translate(5, ${height ? height / 2 : 0})`}
                >
                {text}
            </text>
        </Sizer>
    </g>);
}

export default Label;