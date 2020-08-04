"use strict";

// import { Vertex } from "./Vertex";
// import { Edge } from "./Edge";

export type GraphOptions = {
    Undirected: boolean;
}

type Neighbor = {
    Neighbor: string;
    Weight: number;
}

export class Graph {    
    public Vertices: string[];
    public AdjacencyList: { [name: string]: Neighbor[] };

    public constructor() {
        this.AdjacencyList = {};     // A vertex maps to its adjacency list
    }

    public GetNeighbors = (start: string): Neighbor[] => this.AdjacencyList[start];

    public AddVertex(vertex: string): void {
        if (this.HasVertex(vertex)) { throw new Error("Attempted to insert duplicate vertex"); }
        this.Vertices.push(vertex);
        this.AdjacencyList[vertex] = new Array<Neighbor>();
    }

    public AddEdge(start:  string, end: string, weight = 1): void {
        if (!this.HasVertex(start)) { throw new Error("Attempted to add an edge to a nonexistant vertex..."); }
        this.AdjacencyList[start].push({Neighbor: end, Weight: weight})
    }

    public RemoveEdge(start: string, end: string): void {
        if (this.HasVertex(start)) { this.AdjacencyList[start] = this.AdjacencyList[start].filter(n => n.Neighbor != end); }
    }

    public RemoveVertex(name: string): void {
        this.Vertices.forEach(element => { this.RemoveEdge(element, name); });
        delete this.AdjacencyList[name];
        this.Vertices = this.Vertices.filter(v => v != name);
    }

    public HasVertex  = (name: string): boolean => !(typeof this.AdjacencyList[name] === "undefined");
    private GetNeighbor = (start: string, end: string): Neighbor => this.AdjacencyList[start].reduce((foundNeighbor: Neighbor, current: Neighbor): Neighbor => current.Neighbor == end ? current : foundNeighbor, null);
}