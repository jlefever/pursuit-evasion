export interface IId {
    id: number;
}

export interface IEdge extends IId {
    id: number;
    sourceId: number;
    targetId: number;
}

export interface IBag<V extends IId> {
    get(id: number): V | undefined;
    has(id: number): boolean;
    getIds(): readonly number[];
    getValues(): readonly V[];
    count(): number;
}

export interface IMutableBag<V extends IId> extends IBag<V> {
    add(...eles: V[]): void;
}

export interface IEdgeBag<E extends IEdge> extends IBag<E> {
    hasEdgeFor(sourceId: number, targetId: number): boolean;
    getEdgeFor(sourceId: number, targetId: number): E | undefined;
    getEdgeIdFor(sourceId: number, targetId: number): number | undefined;

    // getIncomingNodeIds(nodeId: number): readonly number[];
    // getIncomingEdges(nodeId: number): readonly E[];
    // getIncomingEdgeIds(nodeId: number): readonly number[];

    // getOutgoingNodeIds(nodeId: number): readonly number[];
    // getOutgoingEdges(nodeId: number): readonly E[];
    // getOutgoingEdgeIds(nodeId: number): readonly number[];
}

export interface IMutableEdgeBag<E extends IEdge> extends IEdgeBag<E>, IMutableBag<E> { }

// export interface IGraph<V extends IId, E extends IEdge> {
//     getNode(nodeId: number): V | undefined;
//     hasNode(nodeId: number): boolean;
//     getNodeIds(): readonly number[];
//     getNodeValues(): readonly V[];
//     getNodeCount(): number;

//     getEdge(edgeId: number): E | undefined;
//     hasEdge(edgeId: number): boolean;
//     getEdgeIds(): readonly number[];
//     getEdgeValues(): readonly E[];
//     getEdgeCount(): number;

//     getEdgeFor(a: number, b: number): E | undefined;
//     getEdgeIdFor(a: number, b: number): number | undefined;
//     hasEdgeFor(a: number, b: number): boolean;

//     getAdjacentNodes(nodeId: number): readonly V[];
//     getAdjacentNodeIds(nodeId: number): readonly number[];
//     getIncidentEdges(nodeId: number): readonly E[];
//     getIncidentEdgeIds(nodeId: number): readonly number[];

//     getDegree(nodeId: number): number | undefined;

//     getNodeBag(): IBag<V>;
//     getEdgeBag(): IBag<E>;
// }

// export interface IUnGraph<V extends IId, E extends IEdge> extends IGraph<V, E> { }

// export interface IDiGraph<V extends IId, E extends IEdge> extends IGraph<V, E> {
//     getIncomingNodes(nodeId: number): readonly V[];
//     getIncomingNodeIds(nodeId: number): readonly number[];
//     getIncomingEdges(nodeId: number): readonly E[];
//     getIncomingEdgeIds(nodeId: number): readonly number[];

//     getOutgoingNodes(nodeId: number): readonly V[];
//     getOutgoingNodeIds(nodeId: number): readonly number[];
//     getOutgoingEdges(nodeId: number): readonly E[];
//     getOutgoingEdgeIds(nodeId: number): readonly number[];

//     getInDegree(nodeId: number): number | undefined;
//     getOutDegree(nodeId: number): number | undefined;
// }

// export interface IMutableGraph<V extends IId, E extends IEdge> extends IGraph<V, E> {
//     addNodes(...nodes: V[]): void;
//     addEdges(...edges: E[]): void;
// }

export interface IForrest<V extends IId> extends IBag<V> {
    isRoot(id: number): boolean;
    isLeaf(id: number): boolean;

    getRoots(): readonly V[];
    getRootIds(): ReadonlyArray<number>;
    getLeaves(): readonly V[];
    getLeafIds(): ReadonlyArray<number>;

    getParent(id: number): V | undefined;
    getParentId(id: number): number | undefined;
    getChildren(id: number): readonly V[];
    getChildIds(id: number): readonly number[];

    getLevel(id: number): number | undefined;
}

export interface IMutableForrest<V extends IId> extends IForrest<V>, IMutableBag<V> {
    setParent(id: number, parentId: number): void;
}

export class MutableBag<V extends IId> implements IMutableBag<V> {
    private readonly _elements: Map<number, V>;

    constructor() {
        this._elements = new Map<number, V>();
    }

    get(id: number): V | undefined {
        return this._elements.get(id);
    }

    has(id: number) {
        return this._elements.has(id);
    }

    getIds(): readonly number[] {
        return Array.from(this._elements.keys());
    }

    getValues(): readonly V[] {
        return Array.from(this._elements.values());
    }

    count(): number {
        return this._elements.size;
    }

    add(...eles: V[]): void {
        for (const ele of eles) {
            if (this.has(ele.id)) {
                throw (`Duplicate id '${ele.id}' found while inserting.`);
            }

            this._elements.set(ele.id, ele);
        }
    }
}

export class MutableForrest<V extends IId> extends MutableBag<V> implements IMutableForrest<V> {
    private readonly _parents: Map<number, number>;
    private readonly _children: Map<number, number[]>;

    constructor() {
        super();
        this._parents = new Map<number, number>();
        this._children = new Map<number, number[]>();
    }

    isRoot(id: number): boolean {
        return !this._parents.has(id);
    }

    isLeaf(id: number): boolean {
        return !this._children.has(id);
    }

    getRoots(): readonly V[] {
        return this.getRootIds().map(id => this.get(id)!);
    }

    getRootIds(): readonly number[] {
        return this.getIds().filter(id => this.isRoot(id));
    }

    getLeaves(): readonly V[] {
        return this.getLeafIds().map(id => this.get(id)!);
    }

    getLeafIds(): readonly number[] {
        return this.getIds().filter(id => this.isLeaf(id));
    }

    getParent(id: number): V | undefined {
        const parentId = this.getParentId(id);
        return parentId ? this.get(parentId) : undefined;
    }

    getParentId(id: number): number | undefined {
        return this._parents.get(id);
    }

    getChildren(id: number): readonly V[] {
        return this.getChildIds(id).map(childId => this.get(childId)!);
    }

    getChildIds(id: number): readonly number[] {
        return this._children.get(id) ?? [];
    }

    getLevel(id: number): number | undefined {
        if (!(this.has(id))) {
            return undefined;
        }

        if (this.isRoot(id)) {
            return 0;
        }

        return this.getLevel(this.getParentId(id)!)! + 1;
    }

    // Technically, nothing is enforcing that this is a tree or forrest.
    setParent(id: number, parentId: number) {
        if (!this.has(id)) {
            throw (`Id '${id}' must be exist.`);
        }

        if (!this.has(parentId)) {
            throw (`ParentId '${parentId}' must exist.`);
        }

        if (this._parents.has(id)) {
            throw (`Id '${id}' already has a parent.`);
        }

        this._parents.set(id, parentId);
        const children = this._children.get(parentId);

        if (!children) {
            this._children.set(parentId, [id]);
            return;
        }

        children.push(id);
    }
}

export class MutableEdgeBag<E extends IEdge> extends MutableBag<E> implements IMutableEdgeBag<E> {
    private readonly _matrix: Array<Array<number | undefined> | undefined>;

    constructor() {
        super();
        this._matrix = new Array<Array<number | undefined> | undefined>();
    }

    hasEdgeFor(sourceId: number, targetId: number) {
        return this.getEdgeIdFor(sourceId, targetId) == undefined;
    }

    getEdgeFor(sourceId: number, targetId: number): E | undefined {
        const id = this.getEdgeIdFor(sourceId, targetId);
        if (!id) return undefined;
        return this.get(id);
    }

    getEdgeIdFor(sourceId: number, targetId: number): number | undefined {
        const adjacencies = this._matrix[sourceId];
        if (!adjacencies) return undefined;
        const id = adjacencies[targetId];
        return id ? id : undefined;
    }

    add(...edges: E[]): void {
        for (const edge of edges) {
            if (!(edge.sourceId in this._matrix)) {
                this._matrix[edge.sourceId] = new Array<number>();
            }

            const adjacencies = this._matrix[edge.sourceId]!;

            if (edge.targetId in adjacencies) {
                throw (`The pair (${edge.sourceId}, ${edge.targetId}) is already assigned.`);
            }

            adjacencies[edge.targetId] = edge.id;
            super.add(edge);
        }
    }
}

// export class MutableUnGraph<V extends IId, E extends IEdge> implements IUnGraph<V, E>, IMutableGraph<V, E> {
//     private readonly _nodes: IMutableBag<V>;
//     private readonly _edges: IMutableBag<E>;
//     private readonly _matrix: number[][];

//     constructor() {
//         this._nodes = new MutableBag<V>();
//         this._edges = new MutableBag<E>();
//         this._matrix = new Array<Array<number>>();
//     }

//     getNode(nodeId: number): V | undefined {
//         return this._nodes.get(nodeId);
//     }

//     hasNode(nodeId: number): boolean {
//         return this._nodes.has(nodeId);
//     }

//     getNodeIds(): readonly number[] {
//         return this._nodes.getIds();
//     }

//     getNodeValues(): readonly V[] {
//         return this._nodes.getValues();
//     }

//     getNodeCount(): number {
//         return this._nodes.count();
//     }

//     getEdge(edgeId: number): E | undefined {
//         return this._edges.get(edgeId);
//     }

//     hasEdge(edgeId: number): boolean {
//         return this._edges.has(edgeId);
//     }

//     getEdgeIds(): readonly number[] {
//         return this._edges.getIds();
//     }

//     getEdgeValues(): readonly E[] {
//         return this._edges.getValues();
//     }

//     getEdgeCount(): number {
//         return this._edges.count();
//     }

//     getEdgeFor(a: number, b: number): E | undefined {
//         throw new Error("Method not implemented.");
//     }

//     getEdgeIdFor(a: number, b: number): number | undefined {
//         throw new Error("Method not implemented.");
//     }

//     hasEdgeFor(a: number, b: number): boolean {
//         throw new Error("Method not implemented.");
//     }

//     getAdjacentNodes(nodeId: number): readonly V[] {
//         throw new Error("Method not implemented.");
//     }

//     getAdjacentNodeIds(nodeId: number): readonly number[] {
//         throw new Error("Method not implemented.");
//     }

//     getIncidentEdges(nodeId: number): readonly E[] {
//         throw new Error("Method not implemented.");
//     }

//     getIncidentEdgeIds(nodeId: number): readonly number[] {
//         throw new Error("Method not implemented.");
//     }

//     getDegree(nodeId: number): number | undefined {
//         throw new Error("Method not implemented.");
//     }

//     getNodeBag(): IBag<V> {
//         return this._nodes;
//     }

//     getEdgeBag(): IBag<E> {
//         return this._edges;
//     }

//     addNodes(...nodes: V[]): void {
//         this._nodes.add(...nodes);
//     }

//     addEdges(...edges: E[]): void {
//         throw new Error("Method not implemented.");
//     }
// }