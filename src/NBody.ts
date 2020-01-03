"use strict";

import { ThreeDPoint, Moon } from "./Types";

export class NBody {
    public readonly Moons: Moon[];

    public constructor(moons: ThreeDPoint[]) {
        this.Moons = new Array<Moon>();
        moons.forEach((moon: ThreeDPoint): void => { this.Moons.push(NBody.CreateMoonState([moon.x, moon.y, moon.z])); });
    }

    public ExecuteNSteps(N: number): NBody {
        for (let i = 0; i < N; i++) { this.ExecuteStep(); }
        return this;
    }

    private static Adjust(position: number[], velocity: number[]): number[] {
        const adjustment = new Array<number>(position.length).fill(0);

        position.forEach((moon: number, index: number): void => {
            const neighbors = position.filter((other: number, inx: number): boolean => index != inx);
            adjustment[index] = neighbors.reduce((total: number, current: number): number => {
                total += NBody.compare(moon, current);
                return total;
            }, 0);
        });

        for (let i=0; i < position.length; i++) {
            velocity[i] += adjustment[i];
            position[i] += velocity[i];
        }

        return [...position, ...velocity];
    }

    private static compare = (first: number, second: number): number => {
        if (first < second) { return 1; }
        if (first > second) { return -1; }
        return 0;
    }

    public ExecuteStep(): NBody {
        // this.AdjustX().AdjustY().AdjustZ();
        // X-values
        const xPos = this.Moons.map((moon: Moon): number => moon.position.x);
        const xVel = this.Moons.map((moon: Moon): number => moon.velocity.x);
        const xAdj = NBody.Adjust(xPos, xVel);

        // Y-values
        const yPos = this.Moons.map((moon: Moon): number => moon.position.y);
        const yVel = this.Moons.map((moon: Moon): number => moon.velocity.y);
        const yAdj = NBody.Adjust(yPos, yVel);

        // Z-values
        const zPos = this.Moons.map((moon: Moon): number => moon.position.z);
        const zVel = this.Moons.map((moon: Moon): number => moon.velocity.z);
        const zAdj = NBody.Adjust(zPos, zVel);

        // Combine them back together
        for (let i=0; i < this.Moons.length; i++) {
            const j = i + this.Moons.length;
            const position = [xAdj[i], yAdj[i], zAdj[i]];
            const velocity = [xAdj[j], yAdj[j], zAdj[j]];
            this.Moons[i] = NBody.CreateMoonState(position, velocity);
        }

        return this;
    }

    public CalculateEnergy(): number {
        const calcEnergy = (point: ThreeDPoint): number => Math.abs(point.x) + Math.abs(point.y) + Math.abs(point.z);

        return this.Moons.reduce((total: number, moon: Moon): number => {
            total += calcEnergy(moon.position) * calcEnergy(moon.velocity);
            return total;
        }, 0);
    }

    public static CreateMoonState(position: number[], velocity: number[] = [0, 0, 0]): Moon {
        if (position.length != 3) { throw new Error("Not enough coordinates to create a moon"); }
        const newPosition = { x: position[0], y: position[1], z: position[2] };
        const newVelocity = { x: velocity[0], y: velocity[1], z: velocity[2] };
        return { position: newPosition, velocity: newVelocity };
    }

    // private static IsSameMoon(first: Moon, second: Moon): boolean { return (first.position.x == second.position.x) && (first.position.y == second.position.y) && (first.position.z == second.position.z); }

    public static Day12Part1(): string {
        const createThreeDPoint = (x: number, y: number, z: number): ThreeDPoint => { return { x: x, y: y, z: z } };

        const input = [
            [-2, 9, -5],
            [16, 19, 9],
            [0, 3, 6],
            [11, 0, 11]
        ].map((moon: number[]): ThreeDPoint => createThreeDPoint(moon[0], moon[1], moon[2]));

        const nbody = new NBody(input);
        const energy = nbody.ExecuteNSteps(1000).CalculateEnergy();
        return energy.toString();
    }

    public static Day12Part2(): string {
        const data = [
            [-2, 9, -5],
            [16, 19, 9],
            [0, 3, 6],
            [11, 0, 11]
        ];

        const equalArrays = (first: number[], second: number[]): boolean => [0, 1, 2, 3].reduce((areEqual: boolean, index: number): boolean => { areEqual = areEqual && (first[index] == second[index]); return areEqual; }, true);
        const extractIthDimension = (i: number): number[] => data.map((moon: number[]): number => moon[i]);
        const calculateCycle = (i: number): bigint => {
            let shouldStop = false;
            let steps = 0n;
            const position = extractIthDimension(i);
            const velocity = [0,0,0,0]

            while (!shouldStop) {
                const adj = NBody.Adjust(position, velocity);
                for (let i=0; i < data.length; i++) {
                    const j = i + data.length;
                    position[i] = adj[i];
                    velocity[i] = adj[j];
                }
                steps++;
    
                if (equalArrays(velocity, [0,0,0,0])) {
                    if (equalArrays(position, extractIthDimension(i))) {
                        shouldStop = true;
                    }
                }
            }

            return steps;
        }
        
        const gcd = (a: bigint, b: bigint): bigint => {
            if (b == 0n) { return a; }
            return gcd(b, a % b);
        }
        const lcm = (a: bigint, b: bigint): bigint => ((a * b) / gcd(a, b));
        
        const xSteps = calculateCycle(0);
        const ySteps = calculateCycle(1);
        const zSteps = calculateCycle(2);

        const result = lcm(lcm(xSteps, ySteps), zSteps);
        return result.toString();
    }
}