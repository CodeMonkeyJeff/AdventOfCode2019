"use strict";

import assert = require("assert");
import { TyrannyOfRocketEquation } from "../src/Days/TyrannyOfRocketEquation";

describe("Day 01 -- TyrannyOfRocketEquation", function(): void {
    describe("GetFuel", function (): void {
        const tests = [
            { mass: 12,     fuel: 2 },
            { mass: 14,     fuel: 2 },
            { mass: 1969,   fuel: 654 },
            { mass: 100756, fuel: 33583 }
        ];

        tests.forEach((test): void => {
            it(test.mass.toString(), function (): void {
                const fuel = TyrannyOfRocketEquation.GetFuel(test.mass);
                assert.equal(fuel, test.fuel);
            });
        });
    });

    describe("GetRecursiveFuel", function (): void {
        const tests = [
            { mass: 14,     fuel: 2},
            { mass: 1969,   fuel: 966},
            { mass: 100756, fuel: 50346}
        ];
        
        tests.forEach((test): void => {
            it(test.mass.toString(), function (): void {
                const fuel = TyrannyOfRocketEquation.GetRecursiveFuel(test.mass);
                assert.equal(fuel, test.fuel);
            });
        });
    });
});