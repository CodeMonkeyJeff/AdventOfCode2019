"use strict";

type Asteroid = {
    x: number;
    y: number;
}

export class MonitoringStation {
    private _asteroids: Asteroid[];

    private get MaxX(): number { return Math.max(...this._asteroids.map((asteroid: Asteroid): number => asteroid.x)); }
    private get MaxY(): number { return Math.max(...this._asteroids.map((asteroid: Asteroid): number => asteroid.y)); }

    public GetViewableAsteroids(asteroid: Asteroid): Asteroid[] {
        let potentialNeighbors = Array.from(this._asteroids).filter((neighbor: Asteroid): boolean => !MonitoringStation.IsSameAsteroid(asteroid, neighbor));
        const viewableAsteroids = new Array<Asteroid>();

        // Until the list of neighbors is empty, we still have work to do
        while (potentialNeighbors.length > 0) {
            const potentialViewables = new Array<Asteroid>();

            const neighbor = potentialNeighbors[0];     
            const dx = neighbor.x - asteroid.x;            
            const dy = neighbor.y - asteroid.y;
            potentialViewables.push(neighbor);

            //* Equation for a line is..
            //*     (x2-x1)(y-y1)-(y2-y1)(x-x1)=0
            potentialNeighbors = potentialNeighbors.filter((potential: Asteroid): boolean => {
                const lhs = dx*(potential.y - asteroid.y);
                const rhs = dy*(potential.x - asteroid.x);
                let liesOnLine = true;

                if (lhs == rhs) { liesOnLine = !MonitoringStation.LieOnSameSideOfRay(asteroid, neighbor, potential); }
                if (!liesOnLine) { potentialViewables.push(potential); }
                return liesOnLine;
            });

            // Good ol' Euclidean metric
            const distance = (second: Asteroid): number => {
                const dx = (second.x - asteroid.x) * (second.x - asteroid.x);
                const dy = (second.y - asteroid.y) * (second.y - asteroid.y);
                return Math.sqrt(dx + dy);
            }

            // Next, find out which of the potentially viewables is actually viewable (i.e., is closest)
            const viewable = potentialViewables.reduce((closest: Asteroid, current: Asteroid): Asteroid => { if (distance(closest) > distance(current)) { return current; } else { return closest; } });
            viewableAsteroids.push(viewable);
        }

        return viewableAsteroids;
    }

    private static LieOnSameSideOfRay(asteroid: Asteroid, first: Asteroid, second: Asteroid): boolean {
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

    public static GetName(asteroid: Asteroid): string { return ["(", asteroid.x, ",", asteroid.y, ")"].join(''); }

    private static IsSameAsteroid(first: Asteroid, second: Asteroid): boolean { return (first.x == second.x) && (first.y == second.y); }

    public static ReadPoints(map: string[]): Asteroid[] {
        const asteroids = new Array<Asteroid>();
        map.forEach((line: string, dy: number): void => {
            for (let dx=0; dx < line.length; dx++) {
                if (line[dx] == '#') { asteroids.push({ x: dx, y: dy }) }
            }
        });

        return asteroids;
    }

    public PrintOrderedMap(baseStation: Asteroid, map: Asteroid[]): void {
        const printOut = new Array<string[]>();

        // Populate the printout
        for (let i=0; i <= this.MaxY; i++) {
            printOut[i] = new Array<string>();
            for (let j=0; j <= this.MaxX; j++) {
                printOut[i].push("  .");
            }
        }

        // Draw it out
        printOut[baseStation.y][baseStation.x] = "  O";
        map.forEach((asteroid: Asteroid, index: number): void => { printOut[asteroid.y][asteroid.x] = index.toString().padStart(3, ' '); });

        // Print it out
        printOut.forEach((row: string[]): void => {
            console.log(row.join(''));
        });
    }

    public PrintNeighborMap(baseStation: Asteroid): void {
        const map = new Array<string[]>();

        // Populate a map
        for (let i=0; i <= this.MaxY; i++) {
            map[i] = new Array<string>();
            for (let j=0; j <= this.MaxX; j++) {
                map[i].push("  .");
            }
        }

        // Draw it out        
        this._asteroids.forEach((asteroid: Asteroid): void => { map[asteroid.y][asteroid.x] = "#".padStart(3, ' '); });
        map[baseStation.y][baseStation.x] = "O".padStart(3, ' ');
        const neighborhood = this.GetViewableAsteroids(baseStation);
        neighborhood.forEach((asteroid: Asteroid): void => { map[asteroid.y][asteroid.x] = "N".padStart(3, ' '); });

        // Print it out
        map.forEach((row: string[]): void => {
            console.log(row.join(''));
        });
    }

    public GetNthVaporizedAsteroid(baseStation: Asteroid, N = 200): Asteroid {

        const getSlope = (first: Asteroid, second: Asteroid): number => {
            const dy = first.y - second.y;
            const dx = first.x - second.x;
            if (dx == 0) { throw new Error("Expecting to normalize baseStation" + MonitoringStation.GetName(first) + " " + MonitoringStation.GetName(second)); }
            return dx/dy;
        }

        const offsetValue = 0.000000001;
        const quad1slope = (neighbor: Asteroid): number => getSlope(neighbor, { x: baseStation.x - offsetValue, y: baseStation.y + offsetValue });
        const quad2slope = (neighbor: Asteroid): number => getSlope(neighbor, { x: baseStation.x - offsetValue, y: baseStation.y - offsetValue });
        const quad3slope = (neighbor: Asteroid): number => getSlope(neighbor, { x: baseStation.x + offsetValue, y: baseStation.y - offsetValue });
        const quad4slope = (neighbor: Asteroid): number => getSlope(neighbor, { x: baseStation.x + offsetValue, y: baseStation.y + offsetValue });

        const currentViewableAsteroids = this.GetViewableAsteroids(baseStation);
        const quad1 = currentViewableAsteroids.filter((asteroid: Asteroid): boolean => (asteroid.x >= baseStation.x) && (asteroid.y < baseStation.y)).sort((first: Asteroid, second: Asteroid): number => quad1slope(second) - quad1slope(first));
        const quad2 = currentViewableAsteroids.filter((asteroid: Asteroid): boolean => (asteroid.x > baseStation.x) && (asteroid.y >= baseStation.y)).sort((first: Asteroid, second: Asteroid): number => quad2slope(second) - quad2slope(first));
        const quad3 = currentViewableAsteroids.filter((asteroid: Asteroid): boolean => (asteroid.x <= baseStation.x) && (asteroid.y > baseStation.y)).sort((first: Asteroid, second: Asteroid): number => quad3slope(second) - quad3slope(first));
        const quad4 = currentViewableAsteroids.filter((asteroid: Asteroid): boolean => (asteroid.x < baseStation.x) && (asteroid.y <= baseStation.y)).sort((first: Asteroid, second: Asteroid): number => quad4slope(second) - quad4slope(first));
        
        const sorted = Array.from(quad1);
        sorted.push(...quad2);
        sorted.push(...quad3);
        sorted.push(...quad4);
        return sorted[N-1];        
    }

    public static Day10Part1(): string {
        const map = ["..............#.#...............#....#....", "#.##.......#....#.#..##........#...#......", "..#.....#....#..#.#....#.....#.#.##..#..#.", "...........##...#...##....#.#.#....#.##..#", "....##....#...........#..#....#......#.###", ".#...#......#.#.#.#...#....#.##.##......##", "#.##....#.....#.....#...####........###...", ".####....#.......#...##..#..#......#...#..", "...............#...........#..#.#.#.......", "........#.........##...#..........#..##...", "...#..................#....#....##..#.....", ".............#..#.#.........#........#.##.", "...#.#....................##..##..........", ".....#.#...##..............#...........#..", "......#..###.#........#.....#.##.#......#.", "#......#.#.....#...........##.#.....#..#.#", ".#.............#..#.....##.....###..#..#..", ".#...#.....#.....##.#......##....##....#..", ".........#.#..##............#..#...#......", "..#..##...#.#..#....#..#.#.......#.##.....", "#.......#.#....#.#..##.#...#.......#..###.", ".#..........#...##.#....#...#.#.........#.", "..#.#.......##..#.##..#.......#.###.......", "...#....###...#......#..#.....####........", ".............#.#..........#....#......#...", "#................#..................#.###.", "..###.........##...##..##.................", ".#.........#.#####..#...##....#...##......", "........#.#...#......#.................##.", ".##.....#..##.##.#....#....#......#.#....#", ".....#...........#.............#.....#....", "........#.##.#...#.###.###....#.#......#..", "..#...#.......###..#...#.##.....###.....#.", "....#.....#..#.....#...#......###...###...", "#..##.###...##.....#.....#....#...###..#..", "........######.#...............#...#.#...#", "...#.....####.##.....##...##..............", "###..#......#...............#......#...#..", "#..#...#.#........#.#.#...#..#....#.#.####", "#..#...#..........##.#.....##........#.#..", "........#....#..###..##....#.#.......##..#", ".................##............#.......#.."];
        const station = new MonitoringStation(map);
        const result = Math.max(...station._asteroids.map((asteroid: Asteroid): number => station.GetViewableAsteroids(asteroid).length));
        return result.toString();
    }

    public static Day10Part2(): string {
        // Yeah..  This is going to be complicated
        const map = ["..............#.#...............#....#....", "#.##.......#....#.#..##........#...#......", "..#.....#....#..#.#....#.....#.#.##..#..#.", "...........##...#...##....#.#.#....#.##..#", "....##....#...........#..#....#......#.###", ".#...#......#.#.#.#...#....#.##.##......##", "#.##....#.....#.....#...####........###...", ".####....#.......#...##..#..#......#...#..", "...............#...........#..#.#.#.......", "........#.........##...#..........#..##...", "...#..................#....#....##..#.....", ".............#..#.#.........#........#.##.", "...#.#....................##..##..........", ".....#.#...##..............#...........#..", "......#..###.#........#.....#.##.#......#.", "#......#.#.....#...........##.#.....#..#.#", ".#.............#..#.....##.....###..#..#..", ".#...#.....#.....##.#......##....##....#..", ".........#.#..##............#..#...#......", "..#..##...#.#..#....#..#.#.......#.##.....", "#.......#.#....#.#..##.#...#.......#..###.", ".#..........#...##.#....#...#.#.........#.", "..#.#.......##..#.##..#.......#.###.......", "...#....###...#......#..#.....####........", ".............#.#..........#....#......#...", "#................#..................#.###.", "..###.........##...##..##.................", ".#.........#.#####..#...##....#...##......", "........#.#...#......#.................##.", ".##.....#..##.##.#....#....#......#.#....#", ".....#...........#.............#.....#....", "........#.##.#...#.###.###....#.#......#..", "..#...#.......###..#...#.##.....###.....#.", "....#.....#..#.....#...#......###...###...", "#..##.###...##.....#.....#....#...###..#..", "........######.#...............#...#.#...#", "...#.....####.##.....##...##..............", "###..#......#...............#......#...#..", "#..#...#.#........#.#.#...#..#....#.#.####", "#..#...#..........##.#.....##........#.#..", "........#....#..###..##....#.#.......##..#", ".................##............#.......#.."];
        const station = new MonitoringStation(map);
        const baseStation = station._asteroids.filter((asteroid: Asteroid): boolean => station.GetViewableAsteroids(asteroid).length == 347)[0];
        const desiredAsteroid = station.GetNthVaporizedAsteroid(baseStation, 200);
        const result = (desiredAsteroid.x * 100) + desiredAsteroid.y;
        return result.toString();
    }
}