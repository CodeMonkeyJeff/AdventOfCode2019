"use strict";

import { ThreeDPoint, Moon } from "../src/Types";
import { NBody } from "../src/NBody";
import assert = require("assert");

const createThreeDPoint = (x: number, y: number, z: number): ThreeDPoint => { return { x: x, y: y, z: z } };

// Used to test CreateMoon
const sampleMoons: number[][] = [
    [-1, 0, 2],
    [2, -10, -7],
    [4, -8, 8],
    [3, 5, -1]
];

// Used to test everything else
const samples: ThreeDPoint[][] = new Array<ThreeDPoint[]>();
samples.push(sampleMoons.map((moon: number[]): ThreeDPoint => createThreeDPoint(moon[0], moon[1], moon[2])));
samples.push([
    [-8, -10, 0],
    [5, 5, 10],
    [2, -7, 3],
    [9, -8, -3]
].map((moon: number[]): ThreeDPoint => createThreeDPoint(moon[0], moon[1], moon[2])));


describe("Day 12 -- NBody", function (): void {
    describe("CreateMoonState", function() {
        const tests = [
            { moon: sampleMoons[0], result: { position: { x: -1, y: 0, z: 2 }, velocity: createThreeDPoint(0, 0, 0) } },
            { moon: sampleMoons[1], result: { position: { x: 2, y: -10, z: -7 }, velocity: createThreeDPoint(0, 0, 0) } },
            { moon: sampleMoons[2], result: { position: { x: 4, y: -8, z: 8 }, velocity: createThreeDPoint(0, 0, 0) } },
            { moon: sampleMoons[3], result: { position: { x: 3, y: 5, z: -1 }, velocity: createThreeDPoint(0, 0, 0) } }
        ];

        tests.forEach((test): void => {
            it(test.moon.join(", "), function() {
                const result = NBody.CreateMoonState(test.moon);
                assert.deepEqual(result, test.result);
            });
        });
    });

    describe("Constructor", function() {
        const results: { [index: number]: Moon[] } = {};

        results[0] = [
            NBody.CreateMoonState([-1, 0, 2], [0, 0, 0]),
            NBody.CreateMoonState([2, -10, -7], [0, 0, 0]),
            NBody.CreateMoonState([4, -8, 8], [0, 0, 0]),
            NBody.CreateMoonState([3, 5, -1],[0,0,0])
        ];

        const tests = [
            { moons: samples[0], results: results[0] }
        ];

        tests.forEach((test, index): void => {
            it("Test " + index.toString(), function() {
                const nbody = new NBody(test.moons);
                assert.deepEqual(nbody.Moons, test.results);                
            });
        });
    });

    describe("ExecuteNSteps", function() {
        const results: { [numSteps: number]: Moon[] } = {};

        results[0] = [
            NBody.CreateMoonState([-1, 0, 2], [0, 0, 0]),
            NBody.CreateMoonState([2, -10, -7], [0, 0, 0]),
            NBody.CreateMoonState([4, -8, 8], [0, 0, 0]),
            NBody.CreateMoonState([3, 5, -1], [0, 0, 0])
        ];

        results[1] = [
            NBody.CreateMoonState([2, -1, 1], [3, -1, -1]),
            NBody.CreateMoonState([3, -7, -4], [1, 3, 3]),
            NBody.CreateMoonState([1, -7, 5], [-3, 1, -3]),
            NBody.CreateMoonState([2, 2, 0], [-1, -3,1]),
        ];

        results[2] = [
            NBody.CreateMoonState([5, -3, -1], [3, -2, -2]),
            NBody.CreateMoonState([1, -2, 2], [-2, 5, 6]),
            NBody.CreateMoonState([1, -4, -1], [0, 3, -6]),
            NBody.CreateMoonState([1, -4, 2], [-1, -6, 2])
        ];

        results[3] = [
            NBody.CreateMoonState([5, -6, -1], [0, -3, 0]),
            NBody.CreateMoonState([0, 0, 6], [-1, 2, 4]),
            NBody.CreateMoonState([2, 1, -5], [1, 5, -4]),
            NBody.CreateMoonState([1, -8, 2], [0, -4, 0])
        ];

        results[4] = [
            NBody.CreateMoonState([2, -8, 0], [-3, -2, 1]),
            NBody.CreateMoonState([2, 1, 7], [2, 1, 1]),
            NBody.CreateMoonState([2, 3, -6], [0, 2, -1]),
            NBody.CreateMoonState([2, -9, 1], [1, -1, -1])
        ];

        results[5] = [
            NBody.CreateMoonState([-1, -9, 2], [-3, -1, 2]),
            NBody.CreateMoonState([4, 1, 5], [2, 0, -2]),
            NBody.CreateMoonState([2, 2, -4], [0, -1, 2]),
            NBody.CreateMoonState([3, -7, -1], [1, 2, -2])
        ];

        const tests = [
            { moons: samples[0], N: 0, result: results[0] },
            { moons: samples[0], N: 1, result: results[1] },
            { moons: samples[0], N: 2, result: results[2] },
            { moons: samples[0], N: 3, result: results[3] },
            { moons: samples[0], N: 4, result: results[4] },
            { moons: samples[0], N: 5, result: results[5] }
        ];

        tests.forEach((test): void => {
            it("N=" + test.N, function () {
                const nbody = (new NBody(test.moons)).ExecuteNSteps(test.N);
                assert.deepEqual(nbody.Moons, test.result);
            });            
        });
    });

    describe("CalculateEnergy", function() {
        const tests = [
            { moons: samples[0], N: 10, result: 179 },
            { moons: samples[1], N: 100, result: 1940 }
        ];

        tests.forEach((test, index): void => {
            it("Test " + index.toString(), function() {
                const energy = (new NBody(test.moons)).ExecuteNSteps(test.N).CalculateEnergy();
                assert.equal(energy, test.result);
            });
        });
    });
});