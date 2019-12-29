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

    public ExecuteStep(): NBody {
        const compare = (first: number, second: number): number => {
            if (first < second) { return 1; }
            if (first > second) { return -1; }
            return 0;
        }
        
        const gravityAdjustment = new Array<ThreeDPoint>(this.Moons.length).fill({ x: 0, y: 0, z: 0 });
        this.Moons.forEach((moon: Moon, index: number): void => { 
            const neighbors = this.Moons.filter((other: Moon): boolean => !NBody.IsSameMoon(other, moon));
            gravityAdjustment[index] =  neighbors.reduce((adjustment: ThreeDPoint, current: Moon): ThreeDPoint => {
                adjustment.x += compare(moon.position.x, current.position.x);
                adjustment.y += compare(moon.position.y, current.position.y);
                adjustment.z += compare(moon.position.z, current.position.z);
    
                return adjustment;
            }, { x: 0, y: 0, z: 0 });
        });

        this.Moons.forEach((moon: Moon, index: number): void => { 
            moon.velocity.x += gravityAdjustment[index].x;
            moon.position.x += moon.velocity.x;

            moon.velocity.y += gravityAdjustment[index].y;
            moon.position.y += moon.velocity.y;

            moon.velocity.z += gravityAdjustment[index].z;
            moon.position.z += moon.velocity.z;
        });

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

    private static IsSameMoon(first: Moon, second: Moon): boolean { return (first.position.x == second.position.x) && (first.position.y == second.position.y) && (first.position.z == second.position.z); }

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
}