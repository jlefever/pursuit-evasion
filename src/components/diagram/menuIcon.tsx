import { Component, createRef, h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import ELK from 'elkjs/lib/elk.bundled.js'
import { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk-api';

import Sizer from './sizer';
import TextNode from './textNode';
import Edge from './edge';

import style from "./style.css";


class MenuIcon extends Component<{}, { graph: ElkNode }> {
    constructor() {
        super();
        const graph = createGraph();
        addNode(graph, "n1");
        addNode(graph, "n2");
        addNode(graph, "n3");
        addNode(graph, "n4");
        addNode(graph, "n5");
        addEdge(graph, "e1", "n1", "n2");
        addEdge(graph, "e2", "n2", "n3");
        addEdge(graph, "e3", "n1", "n4");
        addEdge(graph, "e4", "n1", "n5");
        // addEdge(graph, "e5", "n5", "n1");
        this.state = { graph };
    }

    setChildSize = (id: string, width: number, height: number) => {
        const { graph } = this.state;

        const node = graph.children?.find(c => c.id == id);

        if (!node) return;

        node.width = width;
        node.height = height;

        this.setState({ graph: graph });
        new ELK().layout(this.state.graph).then(this.setGraph).catch(console.error);
    }

    setSize = (width: number, height: number) => {
        this.setGraph({ width: width, height: height, ...this.state.graph });
    }

    setGraph = (graph: ElkNode) => {
        this.setState({ graph: graph });
    }

    render() {
        const { children: nodes, edges } = this.state.graph;

        return (<Sizer setSize={this.setSize}><svg
            width="100%"
            height="600px"
            // viewBox="0 0 24 24"
            // fill="none"
            xmlns="http://www.w3.org/2000/svg">
            {nodes?.map(n => TextNode({ setSize: (w, h) => this.setChildSize(n.id, w, h), text: n.id, ...n }))}
            {edges?.map(e => Edge(e as ElkExtendedEdge))}
        </svg></Sizer>);
    }
}

function createGraph(): ElkNode {
    return {
        id: "root",
        layoutOptions: {
            algorithm: "force",
            // targetWidth: "500.0",
            // alignment: "CENTER"
        }
    }
}

const addNode = (graph: ElkNode, id: string) => {
    if (!graph.children) {
        graph.children = [{ id }];
        return;
    }
    graph.children.push({ id });
}

const addEdge = (graph: ElkNode, id: string, src: string, dst: string) => {
    const edge: ElkExtendedEdge = { id, sources: [src], targets: [dst], sections: [] };
    if (!graph.edges) {
        graph.edges = [edge];
        return;
    }
    graph.edges.push(edge);
}

export default MenuIcon;

