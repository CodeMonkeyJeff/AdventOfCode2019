"use strict";

import { Point } from "./Interface";

export class MonitoringStation {
    private readonly _asteroids: Point[];

    private get MaxX(): number { return Math.max(...this._asteroids.map((asteroid: Point): number => asteroid.x)); }
    private get MaxY(): number { return Math.max(...this._asteroids.map((asteroid: Point): number => asteroid.y)); }

    public GetViewableAsteroids(asteroid: Point): number {
        let numberOfViewableAsteroids = 0;
        let potentialNeighbors = Array.from(this._asteroids).filter((neighbor: Point): boolean => !MonitoringStation.IsSameAsteroid(asteroid, neighbor));

        // Until the list of neighbors is empty, we still have work to do
        while (potentialNeighbors.length > 0) {
            numberOfViewableAsteroids++;
            const neighbor = potentialNeighbors[0];            
            const dx = neighbor.x - asteroid.x;            
            const dy = neighbor.y - asteroid.y;

            //* Equation for a line is..
            //*     (x2-x1)(y-y1)-(y2-y1)(x-x1)=0
            potentialNeighbors = potentialNeighbors.filter((potential: Point): boolean => {
                const lhs = dx*(potential.y - asteroid.y);
                const rhs = dy*(potential.x - asteroid.x);

                if (lhs == rhs) { return !MonitoringStation.LieOnSameSideOfRay(asteroid, neighbor, potential); }

                return true;

            });
        }

        return numberOfViewableAsteroids;
    }

    private static LieOnSameSideOfRay(asteroid: Point, first: Point, second: Point): boolean {
        // If the line is entirely horizontal, compare y values
        if (first.x == asteroid.x) {
            if (first.y < asteroid.y) {
                return (second.y < asteroid.y);
            } else {
                return (second.y > asteroid.y);
            }
        } else {
            if (first.x < asteroid.x) {
                return (second.x < asteroid.x)
            } else {
                return (second.x > asteroid.x);
            }
        }
    }

    public constructor(asteroids: string[]) { 
        const points = MonitoringStation.ReadPoints(asteroids);
        this._asteroids = points;
    }

    public static GetName(asteroid: Point): string { return ["(", asteroid.x, ",", asteroid.y, ")"].join(''); }

    private static IsSameAsteroid(first: Point, second: Point): boolean { return (first.x == second.x) && (first.y == second.y); }

    public static ReadPoints(map: string[]): Point[] {
        const asteroids = new Array<Point>();
        map.forEach((line: string, dy: number): void => {
            for (let dx=0; dx < line.length; dx++) {
                if (line[dx] == '#') { asteroids.push({ x: dx, y: dy }) }
            }
        });

        return asteroids;
    }

    public PrintMap(): void {
        const map = new Array<string[]>();

        // Populate a map
        for (let i=0; i <= this.MaxY; i++) {
            map[i] = new Array<string>();
            for (let j=0; j <= this.MaxX; j++) {
                map[i].push("  .");
            }
        }

        // Draw it out
        this._asteroids.forEach((asteroid: Point): void => {
            const viewableAsteroids = this.GetViewableAsteroids(asteroid);
            map[asteroid.y][asteroid.x] = viewableAsteroids.toString().padStart(3,' ');
        });

        // Print it out
        map.forEach((row: string[]): void => {
            console.log(row.join(''));
        });
    }

    public static Day10Part1(): string {
        const map = ["..............#.#...............#....#....", "#.##.......#....#.#..##........#...#......", "..#.....#....#..#.#....#.....#.#.##..#..#.", "...........##...#...##....#.#.#....#.##..#", "....##....#...........#..#....#......#.###", ".#...#......#.#.#.#...#....#.##.##......##", "#.##....#.....#.....#...####........###...", ".####....#.......#...##..#..#......#...#..", "...............#...........#..#.#.#.......", "........#.........##...#..........#..##...", "...#..................#....#....##..#.....", ".............#..#.#.........#........#.##.", "...#.#....................##..##..........", ".....#.#...##..............#...........#..", "......#..###.#........#.....#.##.#......#.", "#......#.#.....#...........##.#.....#..#.#", ".#.............#..#.....##.....###..#..#..", ".#...#.....#.....##.#......##....##....#..", ".........#.#..##............#..#...#......", "..#..##...#.#..#....#..#.#.......#.##.....", "#.......#.#....#.#..##.#...#.......#..###.", ".#..........#...##.#....#...#.#.........#.", "..#.#.......##..#.##..#.......#.###.......", "...#....###...#......#..#.....####........", ".............#.#..........#....#......#...", "#................#..................#.###.", "..###.........##...##..##.................", ".#.........#.#####..#...##....#...##......", "........#.#...#......#.................##.", ".##.....#..##.##.#....#....#......#.#....#", ".....#...........#.............#.....#....", "........#.##.#...#.###.###....#.#......#..", "..#...#.......###..#...#.##.....###.....#.", "....#.....#..#.....#...#......###...###...", "#..##.###...##.....#.....#....#...###..#..", "........######.#...............#...#.#...#", "...#.....####.##.....##...##..............", "###..#......#...............#......#...#..", "#..#...#.#........#.#.#...#..#....#.#.####", "#..#...#..........##.#.....##........#.#..", "........#....#..###..##....#.#.......##..#", ".................##............#.......#.."];
        const station = new MonitoringStation(map);
        const result = Math.max(...station._asteroids.map((asteroid: Point): number => station.GetViewableAsteroids(asteroid)));
        return result.toString();
    }
}