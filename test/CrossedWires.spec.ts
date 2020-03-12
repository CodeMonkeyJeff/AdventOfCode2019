"use strict";

import assert = require("assert");
import { CrossedWires } from "../src/CrossedWires";

describe("Day 03 -- CrossedWires", function(): void {
    describe("GetClosestIntersectionDistance", function(): void {
        const tests = [
            { wirePath1: ["R8", "U5", "L5", "D3"], wirePath2: ["U7", "R6", "D4", "L4"], result: 6 },
            { wirePath1: ["R75","D30","R83","U83","L12","D49","R71","U7","L72"], wirePath2: ["U62","R66","U55","R34","D71","R55","D58","R83"], result: 159 },
            { wirePath1: ["R98","U47","R26","D63","R33","U87","L62","D20","R33","U53","R51"], wirePath2: ["U98","R91","D20","R16","D67","R40","U7","R15","U6","R7"], result: 135 }
        ];

        tests.forEach((test): void => {
            it("W1: " + test.wirePath1.join(", ") + " " + "W2: " + test.wirePath2.join(", "), function(): void {
                const c = new CrossedWires(test.wirePath1, test.wirePath2).GetClosestIntersectionDistance();
                assert.equal(c, test.result);
            });
        });
    });

    describe("GetFewestCombinedSteps", function(): void {
        const tests = [
            { wirePath1: ["R8", "U5", "L5", "D3"], wirePath2: ["U7", "R6", "D4", "L4"], result: 30 },
            { wirePath1: ["R75","D30","R83","U83","L12","D49","R71","U7","L72"], wirePath2: ["U62","R66","U55","R34","D71","R55","D58","R83"], result: 610 },
            { wirePath1: ["R98","U47","R26","D63","R33","U87","L62","D20","R33","U53","R51"], wirePath2: ["U98","R91","D20","R16","D67","R40","U7","R15","U6","R7"], result: 410 }
        ];

        tests.forEach((test): void => {
            it("W1: " + test.wirePath1.join(", ") + " " + "W2: " + test.wirePath2.join(", "), function(): void {
                const c = new CrossedWires(test.wirePath1, test.wirePath2).GetFewestCombinedSteps();
                assert.equal(c, test.result);
            });
        });
    });
});