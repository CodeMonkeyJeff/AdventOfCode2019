"use strict";

export class Edge {
    public Start: Vertex;
    public End: Vertex;
    public Weight: number;

    constructor(start: Vertex, end: Vertex, weight = 1) {
        this.Start = start;
        this.End = end;
        this.Weight = weight;
    }
}

export interface Vertex {
    name: string;
    edges: Edge[];
}

export class Graph {
    public vertices: Vertex[];
    
    constructor() { this.vertices = new Array<Vertex>(); }
    
    public GetVertex(name: string): Vertex { return this.vertices.find(v => v.name == name); }

    //* Function signature is "Vertex" because we can't instantiate a concrete "Vertex" here.
    public AddVertex(vertex: Vertex): Vertex {
        if (this.GetVertex(vertex.name) === undefined) { this.vertices.push(vertex); }
        return vertex;
    }

    public HasVertex(name: string): boolean { return this.GetVertex(name) === undefined; }

    public GetEdge(start: string, end: string): Edge { 
        const a = this.GetVertex(start);
        if (a === undefined) { return null; }

        const b = this.GetVertex(end);
        if (b === undefined) { return null; }

        return a.edges.find(e => e.End.name == b.name);
    }
    public AddEdge(start: Vertex, end: Vertex, weight = 1): Edge {
        if (this.HasVertex(start.name)) { throw new Error("Tried to add an edge starting at a nonexistant vertex"); }
        if (this.HasVertex(end.name)) { throw new Error("Tried to add an edge ending at a nonexistant vertex"); }

        const edge = new Edge(start, end, weight);
        start.edges.push(edge);
        return edge;
    }
}