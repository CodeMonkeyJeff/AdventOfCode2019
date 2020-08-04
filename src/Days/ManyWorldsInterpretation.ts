"use strict";

import { Graph } from "../Util/Graph";

export class Room {
    public key: string;
    public x: number;
    public y: number;
    public type:  string;

    public constructor(x: number, y: number, type: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.key = "(" + x + "," + y + ")"
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
    private readonly maze: Graph<Room>;

    public constructor(input: string[]) {
        this.input = input;
        this.maze = ManyWorldsInterpretation.ComputeGraph(input);
    }

    public static ComputeGraph(input: string[]): Graph<Room> {
        const graph = new Graph<Room>({ IsUndirectedGraph: true });
        Array<Room>().concat(...input.map((line: string, y: number): Room[] => line.split("").map((c: string, x: number): Room => new Room(x, y, c))))
            .filter(r => r.type != '#')
            .forEach(r => graph.AddVertex(r));
        return graph;
    }
}