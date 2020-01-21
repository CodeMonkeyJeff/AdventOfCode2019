"use strict";

import { IntcodeMachine } from "./IntCodeMachine";
import { TwoDPoint, IntcodeMachineOptions } from "./Types";

import readline = require("readline-sync");

enum MovementCommand {
    North = 1,
    South = 2,
    West = 3,
    East = 4
}

enum MapData {
    Wall = 0,
    Empty = 1,
    OxygenStation = 2,
    Unknown = 98,
    Initial = 99
}

type Position = { [P in keyof TwoDPoint]: TwoDPoint[P]; } & {
    data: MapData;
    neighbors: Position[];
};

// Day 15
export class OxygenSystem {
    private readonly _intcode: bigint[];
    private readonly _map: Position[];              // Centered on robit
    private readonly _distances: { [position: string]: number };
    private readonly _directionsToOrigin: { [position: string]: MovementCommand[] };

    public readonly RepairDroid: IntcodeMachine;
    public readonly Origin: Position;
    public DroidPosition: Position;
    public OxygenStationPosition: Position;

    private getPosition(x: number, y: number): Position {
        // Underlying assumption is that the MapData type remains consistent -- no demolishing walls, right?
        const positions = this.getPositionFromList(this._map, x, y);
        if (positions.length > 0) { return positions[0]; }

        // Haven't pushed this position yet, so need to acount for it
        const position = OxygenSystem.CreatePosition(x, y, MapData.Unknown);
        this._map.push(position);
        return position;
    }

    private setPosition(x: number, y: number, data: MapData): Position {
        const position = this.getPosition(x, y);
        position.data = data;
        return position;
    }

    private static isSamePosition(first: Position, second: Position): boolean { return (first.x == second.x) && (first.y == second.y); }

    private getPositionFromList(list: Position[], x: number, y: number): Position[] { return list.filter((p: Position): boolean => (p.x == x) && (p.y == y)); }
    private static getOppositeMovementCommand(direction: MovementCommand): MovementCommand {
        switch (direction) {
            case MovementCommand.North: return MovementCommand.South; break;
            case MovementCommand.South: return MovementCommand.North; break;
            case MovementCommand.East: return MovementCommand.West; break;
            case MovementCommand.West: return MovementCommand.East; break;
        }
    }

    private static pointToString(x: number, y: number): string { return "(" + x + ", " + y + ")"; }
    private getDistance(position: Position): number { return this._distances[OxygenSystem.pointToString(position.x, position.y)]; }
    private setDistance(position: Position, distance: number): void { this._distances[OxygenSystem.pointToString(position.x, position.y)] = distance; }

    private getCharacter(position: Position): string {
        let character = " ";
        const mapData = position.data;

        switch(mapData) {
            case MapData.Empty:
                character =  ".";
                break;
            case MapData.Initial:
                character = "I";
                break;
            case MapData.OxygenStation:
                character = "O";
                break;
            case MapData.Unknown:
                character =  "?";
                break;
            case MapData.Wall:
                character =  "#";
                break;
        }

        if (OxygenSystem.isSamePosition(position, this.Origin)) { character = "0"; }
        if (OxygenSystem.isSamePosition(position, this.DroidPosition)) { character = "D"; }
        return character;
    }

    public constructor() {
        this._intcode = [3, 1033, 1008, 1033, 1, 1032, 1005, 1032, 31, 1008, 1033, 2, 1032, 1005, 1032, 58, 1008, 1033, 3, 1032, 1005, 1032, 81, 1008, 1033, 4, 1032, 1005, 1032, 104, 99, 101, 0, 1034, 1039, 102, 1, 1036, 1041, 1001, 1035, -1, 1040, 1008, 1038, 0, 1043, 102, -1, 1043, 1032, 1, 1037, 1032, 1042, 1106, 0, 124, 1002, 1034, 1, 1039, 101, 0, 1036, 1041, 1001, 1035, 1, 1040, 1008, 1038, 0, 1043, 1, 1037, 1038, 1042, 1105, 1, 124, 1001, 1034, -1, 1039, 1008, 1036, 0, 1041, 1002, 1035, 1, 1040, 102, 1, 1038, 1043, 1001, 1037, 0, 1042, 1106, 0, 124, 1001, 1034, 1, 1039, 1008, 1036, 0, 1041, 1001, 1035, 0, 1040, 1001, 1038, 0, 1043, 1001, 1037, 0, 1042, 1006, 1039, 217, 1006, 1040, 217, 1008, 1039, 40, 1032, 1005, 1032, 217, 1008, 1040, 40, 1032, 1005, 1032, 217, 1008, 1039, 1, 1032, 1006, 1032, 165, 1008, 1040, 39, 1032, 1006, 1032, 165, 1102, 2, 1, 1044, 1105, 1, 224, 2, 1041, 1043, 1032, 1006, 1032, 179, 1101, 0, 1, 1044, 1105, 1, 224, 1, 1041, 1043, 1032, 1006, 1032, 217, 1, 1042, 1043, 1032, 1001, 1032, -1, 1032, 1002, 1032, 39, 1032, 1, 1032, 1039, 1032, 101, -1, 1032, 1032, 101, 252, 1032, 211, 1007, 0, 45, 1044, 1106, 0, 224, 1101, 0, 0, 1044, 1105, 1, 224, 1006, 1044, 247, 102, 1, 1039, 1034, 102, 1, 1040, 1035, 102, 1, 1041, 1036, 1001, 1043, 0, 1038, 1002, 1042, 1, 1037, 4, 1044, 1106, 0, 0, 12, 89, 14, 22, 56, 12, 54, 34, 71, 12, 40, 31, 83, 2, 95, 25, 4, 70, 18, 59, 32, 11, 19, 23, 67, 17, 25, 18, 72, 14, 60, 9, 85, 6, 84, 89, 2, 14, 10, 44, 85, 34, 63, 11, 23, 79, 6, 56, 4, 88, 69, 20, 2, 88, 87, 31, 56, 16, 68, 29, 84, 43, 58, 6, 14, 98, 73, 3, 35, 79, 24, 89, 43, 59, 12, 78, 86, 13, 10, 61, 37, 46, 44, 61, 25, 12, 71, 36, 65, 79, 31, 5, 71, 13, 99, 90, 87, 35, 40, 98, 3, 80, 69, 97, 31, 37, 93, 37, 78, 34, 48, 32, 51, 41, 75, 50, 16, 25, 10, 92, 88, 28, 50, 7, 95, 11, 15, 99, 10, 61, 56, 25, 14, 99, 23, 23, 90, 73, 66, 94, 23, 60, 34, 26, 73, 44, 38, 71, 41, 42, 79, 10, 25, 69, 43, 39, 92, 19, 35, 95, 23, 60, 8, 75, 38, 55, 82, 40, 44, 29, 84, 82, 33, 36, 63, 93, 10, 7, 50, 41, 22, 76, 79, 59, 42, 61, 40, 72, 4, 51, 5, 83, 99, 22, 79, 33, 6, 53, 62, 30, 77, 37, 22, 94, 84, 43, 19, 60, 52, 44, 82, 99, 23, 47, 29, 68, 57, 38, 66, 40, 55, 17, 15, 78, 86, 10, 54, 25, 52, 39, 62, 35, 11, 19, 15, 75, 12, 20, 63, 67, 98, 35, 70, 17, 95, 66, 24, 37, 56, 10, 75, 3, 95, 35, 41, 62, 8, 3, 60, 72, 5, 98, 61, 27, 42, 63, 16, 55, 29, 6, 54, 48, 40, 7, 66, 92, 31, 48, 16, 41, 87, 86, 6, 16, 24, 53, 85, 17, 4, 12, 20, 89, 74, 5, 84, 67, 27, 37, 67, 30, 29, 27, 92, 46, 40, 14, 77, 95, 50, 17, 31, 38, 44, 83, 12, 39, 12, 98, 96, 20, 7, 69, 82, 7, 12, 75, 49, 85, 59, 17, 44, 98, 58, 28, 94, 34, 81, 49, 48, 66, 51, 43, 5, 96, 52, 22, 81, 36, 83, 94, 32, 28, 94, 27, 97, 18, 99, 32, 49, 53, 31, 16, 61, 57, 18, 87, 22, 93, 18, 21, 25, 77, 33, 78, 41, 34, 69, 5, 28, 15, 87, 38, 98, 38, 41, 83, 10, 61, 90, 21, 92, 35, 93, 51, 35, 92, 23, 50, 23, 5, 51, 97, 60, 36, 69, 4, 62, 20, 39, 88, 11, 48, 56, 9, 92, 8, 85, 78, 62, 24, 62, 82, 15, 16, 30, 81, 34, 9, 98, 94, 8, 16, 85, 22, 75, 40, 62, 78, 25, 70, 16, 47, 28, 93, 32, 21, 62, 53, 94, 62, 14, 75, 19, 69, 8, 47, 9, 39, 90, 35, 10, 86, 50, 15, 84, 42, 72, 19, 24, 5, 77, 79, 3, 93, 66, 6, 89, 16, 11, 55, 32, 37, 38, 28, 50, 78, 21, 29, 35, 13, 95, 71, 3, 14, 12, 96, 23, 75, 33, 97, 26, 41, 96, 88, 68, 22, 39, 18, 4, 7, 46, 91, 8, 55, 39, 37, 28, 47, 79, 38, 73, 11, 72, 8, 28, 76, 70, 69, 27, 84, 37, 84, 79, 81, 34, 71, 97, 43, 94, 74, 13, 58, 14, 64, 20, 53, 22, 67, 86, 39, 46, 28, 50, 34, 62, 54, 8, 41, 24, 68, 57, 80, 94, 32, 79, 18, 61, 15, 90, 23, 6, 67, 92, 18, 18, 83, 36, 46, 44, 31, 76, 39, 2, 77, 23, 93, 10, 67, 37, 25, 46, 19, 87, 21, 2, 92, 92, 92, 68, 27, 13, 38, 42, 85, 13, 46, 39, 61, 96, 9, 53, 29, 44, 81, 84, 91, 11, 79, 75, 5, 13, 88, 84, 19, 1, 18, 38, 86, 42, 6, 85, 63, 40, 93, 3, 33, 83, 41, 82, 51, 79, 37, 85, 1, 53, 40, 39, 74, 33, 54, 29, 23, 49, 21, 31, 43, 29, 98, 32, 70, 59, 10, 24, 21, 74, 89, 20, 96, 78, 21, 25, 9, 99, 52, 8, 39, 64, 25, 29, 95, 37, 49, 94, 35, 1, 85, 48, 5, 97, 23, 64, 41, 98, 14, 76, 97, 55, 56, 11, 23, 81, 42, 98, 43, 46, 37, 22, 99, 1, 98, 91, 58, 20, 23, 94, 53, 63, 23, 59, 8, 32, 94, 37, 70, 24, 33, 69, 79, 77, 35, 32, 52, 79, 17, 62, 31, 30, 70, 61, 20, 2, 54, 17, 46, 36, 75, 58, 61, 33, 71, 10, 50, 10, 53, 10, 79, 30, 79, 41, 91, 80, 52, 20, 54, 65, 84, 24, 85, 9, 69, 11, 54, 12, 83, 86, 54, 27, 68, 9, 86, 0, 0, 21, 21, 1, 10, 1, 0, 0, 0, 0, 0, 0].map((v: number): bigint => BigInt(v));
        this._map = new Array<Position>();
        this._distances = {};
        this._directionsToOrigin = {};

        const options: Partial<IntcodeMachineOptions> = { BreakBeforeInput: true, BreakOnOutput: true, SilentMode: true };
        this.RepairDroid = new IntcodeMachine(this._intcode, options);
        this.DroidPosition = this.setPosition(0, 0, MapData.Initial);
        this.OxygenStationPosition = null;
        this.Origin = this.DroidPosition;
        this._directionsToOrigin[OxygenSystem.pointToString(0, 0)] = [];
    }


    // Returns true if the droid has moved.  Otherwise false.
    public MoveDroid(input: MovementCommand): boolean {
        this.RepairDroid.InputValues.push(BigInt(input));
        this.RepairDroid.ExecuteTape();
        const mapData: MapData = Number(this.RepairDroid.OutputValues.shift());

        let newPosition: Position = null;

        switch (input) {
            case MovementCommand.North:
                newPosition = this.setPosition(this.DroidPosition.x, this.DroidPosition.y - 1, mapData);
                break;
            case MovementCommand.South:
                newPosition = this.setPosition(this.DroidPosition.x, this.DroidPosition.y + 1, mapData);
                break;
            case MovementCommand.East:
                newPosition = this.setPosition(this.DroidPosition.x + 1, this.DroidPosition.y, mapData);
                break;
            case MovementCommand.West:
                newPosition = this.setPosition(this.DroidPosition.x - 1, this.DroidPosition.y, mapData);
                break;
        }

        if ((newPosition.x == 0) && (newPosition.y == 0)) { newPosition.data = MapData.Initial; }
        if (mapData != MapData.Wall) {
            if (mapData == MapData.OxygenStation) { this.OxygenStationPosition = newPosition; }

            this.AddNeighbor(this.DroidPosition, newPosition, input);
            this.DroidPosition = newPosition; // Only move the droid if not a wall

            return true;
        } else {
            return false;
        }
    }

    // Returns true if neighbor is new.  Otherwise false.
    public AddNeighbor(current: Position, neighbor: Position, direction: MovementCommand): boolean {
        if (this.getPositionFromList(this.DroidPosition.neighbors, neighbor.x, neighbor.y).length == 0) {
            current.neighbors.push(neighbor);

            // Adding directions (which may not be optimal..)
            const newPositionString = OxygenSystem.pointToString(neighbor.x, neighbor.y);
            const droidPositionString = OxygenSystem.pointToString(this.DroidPosition.x, this.DroidPosition.y);

            if (this._directionsToOrigin[newPositionString] === undefined) {
                this._directionsToOrigin[newPositionString] = this._directionsToOrigin[droidPositionString].slice();
                this._directionsToOrigin[newPositionString].push(direction);
            }

            return true;
        }

        return false;
    }

    public MoveToPosition(position: Position): void {
        //* Moving back to origin (don't do anything if already at origin!)
        if (!OxygenSystem.isSamePosition(this.Origin, this.DroidPosition)) {
            const toOrigin = this._directionsToOrigin[OxygenSystem.pointToString(this.DroidPosition.x, this.DroidPosition.y)].slice();  // slice() will return a new array
            while (toOrigin.length > 0) {
                const direction = OxygenSystem.getOppositeMovementCommand(toOrigin.pop());
                this.MoveDroid(direction);
            }
        }
        // Error checking that we got back to the origin
        if (!OxygenSystem.isSamePosition(this.getPosition(0, 0), this.DroidPosition)) { throw new Error("Directions didn't take us back to origin.."); }

        //* Move from origin to position (don't do anything if position is origin!)
        if (!OxygenSystem.isSamePosition(this.Origin, position)) {
            const toPosition = this._directionsToOrigin[OxygenSystem.pointToString(position.x, position.y)].slice();    // slice() will return a new array
            while (toPosition.length > 0) {
                const direction = toPosition.shift();
                this.MoveDroid(direction);
            }
        }
        // Error checking that we got to where we are going
        if (!OxygenSystem.isSamePosition(this.getPosition(position.x, position.y), this.DroidPosition)) { throw new Error("Directions didn't take us to desired position.."); }

    }

    public BuildMap(runInteractive = false): OxygenSystem {
        // Create four nodes, one in each cardinal direction .. if they don't already exist..
        const createNeighbors = (current: Position): Position[] => {
            const neighbors = new Array<Position>();
            neighbors.push(this.getPosition(current.x, current.y - 1));     // N
            neighbors.push(this.getPosition(current.x, current.y + 1));     // S
            neighbors.push(this.getPosition(current.x + 1, current.y));     // E
            neighbors.push(this.getPosition(current.x - 1, current.y));     // W
            return neighbors.filter((p: Position): boolean => p.data != MapData.Wall);
        };

        // Create nodes for every cardinal direction.  This will also create a list of adjacent nodes
        const exploreNeighbors = (): void =>  {
            const neighbors = createNeighbors(this.DroidPosition);
            neighbors.forEach((neighbor: Position): void => {
                const dx = this.DroidPosition.x - neighbor.x;   // +1 -> W, -1 -> E
                const dy = this.DroidPosition.y - neighbor.y;   // +1 -> S, -1 => N
                
                if (dx == 1) {
                    const droidMoved = this.MoveDroid(MovementCommand.West);
                    if (droidMoved) { this.MoveDroid(MovementCommand.East); }
                }

                if (dx == -1) {
                    const droidMoved = this.MoveDroid(MovementCommand.East);
                    if (droidMoved) { this.MoveDroid(MovementCommand.West); }
                }

                if (dy == 1) {
                    const droidMoved = this.MoveDroid(MovementCommand.North);
                    if (droidMoved) { this.MoveDroid(MovementCommand.South); }
                    // const droidMoved = this.MoveDroid(MovementCommand.South);
                    // if (droidMoved) { this.MoveDroid(MovementCommand.North); }
                }

                if (dy == -1) {
                    const droidMoved = this.MoveDroid(MovementCommand.South);
                    if (droidMoved) { this.MoveDroid(MovementCommand.North); }
                    // const droidMoved = this.MoveDroid(MovementCommand.North);
                    // if (droidMoved) { this.MoveDroid(MovementCommand.South); }
                }
            });

            if (runInteractive) { this.PrintMap(); readline.question("Current position is " + OxygenSystem.pointToString(this.DroidPosition.x, this.DroidPosition.y)); }
        }

        const isDiscovered = (position: Position, discovered: Position[]): boolean => this.getPositionFromList(discovered, position.x, position.y).length > 0;
        //* Implementing an iterative DFS starting at (0,0)
        //*     *  p.neighbors will never be empty (or it would be surrounded by 4 walls..)
        //*

        const toExplore: Position[] = new Array<Position>();
        const discovered: Position[] = new Array<Position>();

        toExplore.push(this.getPosition(0,0));
        while (toExplore.length > 0) {
            const p = toExplore.pop();
            if (!isDiscovered(p, discovered)) {
                this.MoveToPosition(p);
                exploreNeighbors(); // Around p

                discovered.push(p);
                const undiscoveredNeighbors = p.neighbors.filter((neighbor: Position): boolean => !isDiscovered(neighbor, discovered));
                toExplore.push(...undiscoveredNeighbors);

                if (this.OxygenStationPosition != null) { break; }
            }
        }

        return this;
    }

    public BuildDistances(): OxygenSystem {
        const Q: Position[] = new Array<Position>();
        this.setDistance(this.getPosition(0, 0), 0);
        this._map.forEach((p: Position): void => {
            if (!((p.x == 0) && (p.y == 0))) { this.setDistance(p, Number.MAX_SAFE_INTEGER); }
            Q.push(p);
        });

        const popMinV = (): Position => {
            Q.sort((first: Position, second: Position): number => this.getDistance(first) - this.getDistance(second));
            return Q.shift();
        }

        while (Q.length > 0) {
            const v = popMinV();

            v.neighbors.forEach((p: Position): void => {
                const alt = this.getDistance(v) + 1;
                if (alt < this.getDistance(p)) { this.setDistance(p, alt); }
            });
        }

        return this;
    }

    public PrintMap(): void {
        const minX = Math.min(-10, ...this._map.map((p: Position): number => p.x));
        const maxX = Math.max(10, ...this._map.map((p: Position): number => p.x));
        const minY = Math.min(-10, ...this._map.map((p: Position): number => p.y));
        const maxY = Math.max(10, ...this._map.map((p: Position): number => p.y));

        const printOut = new Array<string[]>();
        for (let i=0; i < maxY - minY + 1; i++) {
            printOut.push(new Array<string>());
            for (let j=0; j < maxX - minX + 1; j++) {
                printOut[i].push(" ");
            }
        }

        this._map.forEach((p: Position): void => { printOut[p.y - minY][p.x - minX] = this.getCharacter(p); });        
        printOut.forEach((row: string[]): void => { console.log(row.join('')); });
    }

    public RunInteractiveMode(): void {
        const printMovementCommandEnum = (): void => {
            const indent = 10;
            console.log("Current Position:  " + OxygenSystem.pointToString(this.DroidPosition.x, this.DroidPosition.y));
            console.log("North".padEnd(indent, " ").padStart(2 * indent, " ") + MovementCommand.North);
            console.log("South".padEnd(indent, " ").padStart(2 * indent, " ") + MovementCommand.South);
            console.log("West".padEnd(indent, " ").padStart(2 * indent, " ") + MovementCommand.West);
            console.log("East".padEnd(indent, " ").padStart(2 * indent, " ") + MovementCommand.East);
            console.log("Exit".padEnd(indent, " ").padStart(2 * indent, " ") + "0");
        }

        printMovementCommandEnum();
        readline.promptLoop((input: string): boolean => {
            const direction = parseInt(input) % 5;
            if (direction != 0) {
                this.MoveDroid(direction);
                
                console.log();
                this.PrintMap();
                console.log();

                printMovementCommandEnum();
            }

            return (direction == 0);
        });
    }

    public static Day15Part1(): string {
        const system = new OxygenSystem();
        // system.RunInteractiveMode();
        system.BuildMap()
            .BuildDistances();

        return system.getDistance(system.OxygenStationPosition).toString();
    }

    public static CreatePosition(x: number, y: number, data: MapData): Position { return { x: x, y: y, data: data, neighbors: new Array<Position>() }; }
}