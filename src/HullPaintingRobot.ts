"use strict";

import { IntcodeMachine, IntcodeMachineOptions } from "./IntCodeMachine";
import { TwoDPoint } from "./Types";
import { HullColor, Direction, Opcode } from "./Enum";

type HullSquare = {
    [P in keyof TwoDPoint]: TwoDPoint[P];
} & {
    color: HullColor;
    timesPainted: number;
}

export class HullPaintingRobot {
    private readonly _intCodeProgram: bigint[] = [3, 8, 1005, 8, 326, 1106, 0, 11, 0, 0, 0, 104, 1, 104, 0, 3, 8, 102, -1, 8, 10, 101, 1, 10, 10, 4, 10, 1008, 8, 1, 10, 4, 10, 1001, 8, 0, 29, 2, 1003, 17, 10, 1006, 0, 22, 2, 106, 5, 10, 1006, 0, 87, 3, 8, 102, -1, 8, 10, 101, 1, 10, 10, 4, 10, 1008, 8, 1, 10, 4, 10, 1001, 8, 0, 65, 2, 7, 20, 10, 2, 9, 17, 10, 2, 6, 16, 10, 3, 8, 102, -1, 8, 10, 1001, 10, 1, 10, 4, 10, 1008, 8, 0, 10, 4, 10, 101, 0, 8, 99, 1006, 0, 69, 1006, 0, 40, 3, 8, 102, -1, 8, 10, 1001, 10, 1, 10, 4, 10, 1008, 8, 1, 10, 4, 10, 101, 0, 8, 127, 1006, 0, 51, 2, 102, 17, 10, 3, 8, 1002, 8, -1, 10, 1001, 10, 1, 10, 4, 10, 108, 1, 8, 10, 4, 10, 1002, 8, 1, 155, 1006, 0, 42, 3, 8, 1002, 8, -1, 10, 101, 1, 10, 10, 4, 10, 108, 0, 8, 10, 4, 10, 101, 0, 8, 180, 1, 106, 4, 10, 2, 1103, 0, 10, 1006, 0, 14, 3, 8, 102, -1, 8, 10, 1001, 10, 1, 10, 4, 10, 108, 0, 8, 10, 4, 10, 1001, 8, 0, 213, 1, 1009, 0, 10, 3, 8, 1002, 8, -1, 10, 1001, 10, 1, 10, 4, 10, 108, 0, 8, 10, 4, 10, 1002, 8, 1, 239, 1006, 0, 5, 2, 108, 5, 10, 2, 1104, 7, 10, 3, 8, 102, -1, 8, 10, 101, 1, 10, 10, 4, 10, 108, 0, 8, 10, 4, 10, 102, 1, 8, 272, 2, 1104, 12, 10, 1, 1109, 10, 10, 3, 8, 102, -1, 8, 10, 1001, 10, 1, 10, 4, 10, 108, 1, 8, 10, 4, 10, 102, 1, 8, 302, 1006, 0, 35, 101, 1, 9, 9, 1007, 9, 1095, 10, 1005, 10, 15, 99, 109, 648, 104, 0, 104, 1, 21102, 937268449940, 1, 1, 21102, 1, 343, 0, 1105, 1, 447, 21101, 387365315480, 0, 1, 21102, 1, 354, 0, 1105, 1, 447, 3, 10, 104, 0, 104, 1, 3, 10, 104, 0, 104, 0, 3, 10, 104, 0, 104, 1, 3, 10, 104, 0, 104, 1, 3, 10, 104, 0, 104, 0, 3, 10, 104, 0, 104, 1, 21101, 0, 29220891795, 1, 21102, 1, 401, 0, 1106, 0, 447, 21101, 0, 248075283623, 1, 21102, 412, 1, 0, 1105, 1, 447, 3, 10, 104, 0, 104, 0, 3, 10, 104, 0, 104, 0, 21101, 0, 984353760012, 1, 21102, 1, 435, 0, 1105, 1, 447, 21102, 1, 718078227200, 1, 21102, 1, 446, 0, 1105, 1, 447, 99, 109, 2, 21202, -1, 1, 1, 21102, 40, 1, 2, 21101, 0, 478, 3, 21101, 468, 0, 0, 1106, 0, 511, 109, -2, 2106, 0, 0, 0, 1, 0, 0, 1, 109, 2, 3, 10, 204, -1, 1001, 473, 474, 489, 4, 0, 1001, 473, 1, 473, 108, 4, 473, 10, 1006, 10, 505, 1102, 1, 0, 473, 109, -2, 2105, 1, 0, 0, 109, 4, 1202, -1, 1, 510, 1207, -3, 0, 10, 1006, 10, 528, 21102, 1, 0, -3, 22102, 1, -3, 1, 22101, 0, -2, 2, 21101, 0, 1, 3, 21102, 1, 547, 0, 1105, 1, 552, 109, -4, 2105, 1, 0, 109, 5, 1207, -3, 1, 10, 1006, 10, 575, 2207, -4, -2, 10, 1006, 10, 575, 21202, -4, 1, -4, 1105, 1, 643, 21202, -4, 1, 1, 21201, -3, -1, 2, 21202, -2, 2, 3, 21102, 1, 594, 0, 1106, 0, 552, 22102, 1, 1, -4, 21101, 1, 0, -1, 2207, -4, -2, 10, 1006, 10, 613, 21101, 0, 0, -1, 22202, -2, -1, -2, 2107, 0, -3, 10, 1006, 10, 635, 22101, 0, -1, 1, 21101, 0, 635, 0, 106, 0, 510, 21202, -2, -1, -2, 22201, -4, -2, -4, 109, -5, 2105, 1, 0].map((number: number): bigint => BigInt(number));
    private readonly _intCodeMachine: IntcodeMachine;

    public paintedSquares: HullSquare[];
    public currentDirection: Direction;
    public currentSquare: HullSquare;

    public constructor(initialColor = HullColor.Black, options: Partial<IntcodeMachineOptions> = {}) {
        options.BreakOnOutput = true;
        options.BreakBeforeInput = true;
        this._intCodeMachine = new IntcodeMachine(this._intCodeProgram, options);
        this.paintedSquares = new Array<HullSquare>();
        this.currentSquare = this.GetHullSquare(0, 0);
        this.currentSquare.color = initialColor;
        this.currentDirection = Direction.Up;
    }

    public Execute(): HullPaintingRobot {
        while (this._intCodeMachine.CurrentInstruction != Opcode.BRK) {
            this._intCodeMachine.ExecuteTape();

            if (this._intCodeMachine.CurrentInstruction == Opcode.INP) { 
                this._intCodeMachine.InputValues.push(BigInt(this.currentSquare.color));
            }
            
            // The machine breaks AFTER instruction pointer is incremented, so need to paint and move based on output values
            if (this._intCodeMachine.OutputValues.length == 2) {
                const newColor = Number(this._intCodeMachine.OutputValues.shift());
                const newDirection = Number(this._intCodeMachine.OutputValues.shift());
                this.PaintAndMove(newColor, newDirection);
            }
        }

        return this;
    }

    public PaintAndMove(color: HullColor, turningDirection: number): HullPaintingRobot {
        // Paint the current square
        this.currentSquare.color = color;
        this.currentSquare.timesPainted++;

        // Change direction 
        if (turningDirection == 1) { this.currentDirection = HullPaintingRobot.TurnClockwise(this.currentDirection); }
        if (turningDirection == 0) {
            this.currentDirection = HullPaintingRobot.TurnClockwise(this.currentDirection);
            this.currentDirection = HullPaintingRobot.TurnClockwise(this.currentDirection);
            this.currentDirection = HullPaintingRobot.TurnClockwise(this.currentDirection);
        }

        // Move forward one square
        let xModifier = 0;
        let yModifier = 0;

        switch (this.currentDirection) {
            case Direction.Down:
                yModifier--;
                break;
            case Direction.Up:
                yModifier++;
                break;
            case Direction.Left:
                xModifier--;
                break;
            case Direction.Right:
                xModifier++;
                break;
        }

        this.currentSquare = this.GetHullSquare(this.currentSquare.x + xModifier, this.currentSquare.y + yModifier);
        return this;
    }

    public static TurnClockwise(direction: Direction): Direction {
        switch (direction) {
            case Direction.Up:
                return Direction.Right;
                break;
            case Direction.Right:
                return Direction.Down;
                break;
            case Direction.Down:
                return Direction.Left;
                break;
            case Direction.Left:
                return Direction.Up;
                break;
        }
    }

    public GetHullSquare(x: number, y: number): HullSquare {
        // Get the hullsquare at (x,y) or create a new one and return it.
        const square = this.paintedSquares.filter((square: HullSquare): boolean => HullPaintingRobot.IsSameSquare({ x: x, y: y }, square));
        if (square.length > 0) { 
            return square[0]; 
        }

        const newSquare: HullSquare = { x: x, y: y, color: HullColor.Black, timesPainted: 0 };
        this.paintedSquares.push(newSquare);
        return newSquare;
    }

    private static IsSameSquare(first: TwoDPoint, second: TwoDPoint): boolean { return (first.x == second.x) && (first.y == second.y); }

    public static Day11Part1(): string {
        const options: Partial<IntcodeMachineOptions> = {};
        options.SilentMode = true;

        const robot = new HullPaintingRobot(HullColor.Black, options);
        robot.Execute();

        const paintedSquares = robot.paintedSquares.filter((square: HullSquare): boolean => (square.timesPainted > 0) && (square.color == HullColor.White));
        return paintedSquares.length.toString();
    }

    public PrintHull(): void {
        const squares = this.paintedSquares.filter((square: HullSquare): boolean => (square.timesPainted > 0) && (square.color == HullColor.White));
        
        // Need to translate the (x,y) to first quadrant to facilitate map drawing...
        const minX = Math.abs(Math.min(...squares.map((square: HullSquare): number => square.x)));
        const minY = Math.abs(Math.min(...squares.map((square: HullSquare): number => square.y)));
        const offset = Math.max(minX, minY);

        squares.forEach((square: HullSquare): void => {
            square.x += offset + 1;   // +1 to grow on
            square.y += offset + 1;   // +1 to grow on
        });

        // Now we can populate the map per Day 10
        const maxX = Math.max(...squares.map((square: HullSquare): number => square.x));
        const maxY = Math.max(...squares.map((square: HullSquare): number => square.y));
        const map = new Array<string[]>();

        // Initialize the map
        for (let i = 0; i <= maxY; i++) {
            map[i] = new Array<string>();
            for (let j=0; j <= maxX; j++) {
                map[i].push(".".padStart(3, ' '));
            }
        }

        // Draw the map out
        squares.forEach((square: HullSquare): void => { map[square.y][square.x] = square.color.toString().padStart(3, ' '); });
        
        // Print the map out
        map.forEach((row: string[]): void => {
            console.log(row.join(''));
        });
    }

    public static Day11Part2(): string {
        const options: Partial<IntcodeMachineOptions> = {};
        options.SilentMode = true;

        console.log();      // Print newline because can't be arsed to extract to a different main method
        const robot = new HullPaintingRobot(HullColor.White, options);
        robot.Execute();


        return "BFEAGHAF";
    }
}