import { h } from "preact";

interface CircleProps {
    cx: number;
    cy: number;
    r: number;
};

function Circle(props: CircleProps) {
    const { cx, cy, r } = props;

    return <circle
        cx={cx} cy={cy} r={r}
        fill="#B486F0" stroke="#D8C4F2" stroke-width="3"
    />;
}

export default Circle;