import { Component, createRef, RefObject, VNode } from 'preact';

type SizerProps = {
    children: VNode<SVGGraphicsElement>;
    setSize?: (width: number, height: number) => void;
}

class Sizer extends Component<SizerProps> {
    ref: RefObject<SVGGraphicsElement> = createRef();

    componentDidMount() {
        if (!this.props.setSize) return;
        const box = this.ref?.current?.getBoundingClientRect();
        if (!box) return;
        this.props.setSize(box.width, box.height);
    }

    render() {
        this.props.children.ref = this.ref;
        return this.props.children;
    }
}

export default Sizer;