"use strict";

import { Edge, Graph, Vertex } from "../Util/Graph";

export class Room implements Vertex {
    public name: string;
    public edges: Edge[];
    public x: number;
    public y: number;
    public type: string;

    public constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.name = "(" + x + "," + y + ")"
    }
}

// enum RoomType {
//     Key,
//     Door,
//     Start,
//     Passage,
//     Wall
// }
export class ManyWorldsInterpretation {
    private readonly input: string[];
    private readonly maze: Graph;
    private readonly rooms: Array<Room>;

    public constructor(input: string[]) {
        this.input = input;
        this.rooms = ManyWorldsInterpretation.ReadRoomData(input);
        this.maze = ManyWorldsInterpretation.ComputeGraph(this.rooms);
    }

    public static ReadRoomData(input: string[]): Room[] {
        return Array<Room>()
            .concat(...input.map((line: string, y: number): Room[] =>
                line.split("").map((c: string, x: number): Room => new Room(x, y, c))))
            .filter(r => r.type != '#');
    }

    public static ComputeGraph(rooms: Room[]): Graph {
        const graph = new Graph();

        // Add all the vertices.  We can add edges in a minute.
        rooms.forEach(r => graph.AddVertex(r));

        // All edges have taxicab distance +1
        rooms.forEach(currentRoom => 
            rooms.filter(potentialNeighbor => Math.abs(currentRoom.x - potentialNeighbor.x) + Math.abs(currentRoom.y - potentialNeighbor.y) == 1)
                .forEach(neighbor => graph.AddEdge(currentRoom, neighbor)));

        // Classifying certain passages as "intersections"
        const passages = rooms.filter(r => r.type == '.');
        
        return graph;
    }

    // public static CompressGraph(maze: Graph): Graph {} 
}