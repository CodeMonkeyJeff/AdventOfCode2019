"use strict";

import { WireDirection } from "./Enum";
import { GridDimension, GridPosition } from "./Interface";

export class CrossedWires {
    public WirePath1: string[];
    public WirePath2: string[];
    private dx: number;
    private dy: number;
    public origin: GridPosition;


    public constructor(path1: string[], path2: string[]) {
        this.WirePath1 = path1;
        this.WirePath2 = path2;

        // Grid dimensions is the max value a wire goes left/right and up/down
        const directions = this.GetGridDimensions();
        this.dx = directions.Left + directions.Right;
        this.dy = directions.Up + directions.Down; 

        // Origin of our grid is 1 plus the max left squares and 1 plus the up squares
        this.origin = { x: 1 + directions.Left, y: 1 + directions.Up }
    }

    public GetWirePositions(path: string[]): GridPosition[] {
        const positions: GridPosition[] = Array<GridPosition>(path.length);
        positions.push(this.origin);
        const current = this.origin;

        path.forEach((val: string): void => {
            const endpoint = Number.parseInt(val[1]);        // Should be integer
            for (let i=0; i < endpoint; i++) {
                switch(val[0]) {
                    case WireDirection.Down:
                        current.y -= 1;
                        break;
                    case WireDirection.Up:
                        current.y += 2;
                        break;
                    case WireDirection.Left:
                        current.x -= 1;
                        break;
                    case WireDirection.Right:
                        current.x += 1;
                        break;
                }

                positions.push(current);
            }
        });

        return positions;
    }

    public PrintWireGrid(): void {
        

        for (let x=0; x < this.dx; x++) {
            for (let y=0; y < this.dy; y++) {
                process.stdout.write(".");
            }
            console.log();
        }
    }

    public GetGridDimensions(): GridDimension {
        // Return value is going to be this JSON object
        const dimensions: GridDimension = { Up: 0, Down: 0, Left: 0, Right: 0 };        
        const getMaxInDirection = (path: string[], direction: WireDirection): number => {
            return path.filter(function (val: string): boolean { return val[0] == direction; })
                .map((val: string) => Number.parseInt(val[1]))
                .reduce((total: number, val: number) => total + val) + 1;
        }
        const getDimension = (direction: WireDirection): number => {
            const d1 = getMaxInDirection(this.WirePath1, direction);
            const d2 = getMaxInDirection(this.WirePath2, direction);
            return Math.max(d1, d2);
        }
        
        dimensions.Up = getDimension(WireDirection.Up);         // Up\
        dimensions.Down = getDimension(WireDirection.Down);     // Down
        dimensions.Left = getDimension(WireDirection.Left);     // Left
        dimensions.Right = getDimension(WireDirection.Right);   // Right

        return dimensions;
    }
}