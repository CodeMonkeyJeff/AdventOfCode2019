"use strict";

export type GraphOptions = {
    IsUndirectedGraph: boolean;
}

type Neighbor = {
    NeighborKey: string;
    Weight: number;
}

export interface HasKey {
    key: string;
}

export class Graph<T extends HasKey> {
    public Vertices: T[];
    public AdjacencyList: { [name: string]: Neighbor[] };

    private readonly _options: GraphOptions;

    public constructor(options: Partial<GraphOptions> = {}) {
        this.AdjacencyList = {};     // A vertex maps to its adjacency list
        this._options = Object.assign({
            IsUndirectedGraph: true,
        }, options);
    }

    public GetNeighbors = (start: string): Neighbor[] => this.AdjacencyList[start];

    public AddVertex(vertex: T): void {
        if (!this.HasVertex(vertex)) { 
            this.Vertices.push(vertex);
            this.AdjacencyList[vertex.key] = new Array<Neighbor>();
        }        
    }

    public AddEdge(start: T, end: T, weight = 1): void {
        this.AddVertex(start);
        this.AddVertex(end);

        if (! this.HasNeighbor(start, end)) {
            this.AdjacencyList[start.key].push({NeighborKey: end.key, Weight: weight})
        }        
        
        if (this._options.IsUndirectedGraph) {
            if (! this.HasNeighbor(end, start)) {
                this.AdjacencyList[end.key].push({NeighborKey: start.key, Weight: weight})
            }
        }
    }

    public RemoveEdge(start: T, end: T): void {
        this.AdjacencyList[start.key] = this.AdjacencyList[start.key].filter(n => n.NeighborKey != end.key);
    }

    public RemoveVertex(name: T): void {
        this.Vertices.forEach(element => { this.RemoveEdge(element, name); });
        delete this.AdjacencyList[name.key];        
        this.Vertices = this.Vertices.filter(v => v.key != name.key);
    }

    public HasVertex  = (name: T): boolean => !(typeof this.AdjacencyList[name.key] === "undefined");
    private HasNeighbor = (vertex: T, neighbor: T): boolean => this.AdjacencyList[vertex.key].filter(e => e.NeighborKey == neighbor.key).length > 0;

    private GetNeighbor = (start: T, end: T): Neighbor => this.AdjacencyList[start.key].reduce((foundNeighbor: Neighbor, current: Neighbor): Neighbor => current.NeighborKey == end.key ? current : foundNeighbor, null);    
}