"use strict";

import assert = require("assert");
import { UniversalOrbitMap } from "../src/Days/UniversalOrbitMap";

describe("Day 06 -- UniversalOrbitMap", function(): void {
    describe("addOrbit", function(): void {
        const tests = [
            { orbit: "COM)B", result: { "B": "COM"} },
            { orbit: "B)C", result: { "C": "B"} },
            { orbit: "C)D", result: { "D": "C"} },
            { orbit: "D)E", result: { "E": "D"} },
            { orbit: "E)F", result: { "F": "E"} },
            { orbit: "B)G", result: { "G": "B"} },
            { orbit: "G)H", result: { "H": "G"} },
            { orbit: "D)I", result: { "I": "D"} },
            { orbit: "E)J", result: { "J": "E"} },
            { orbit: "K)L", result: { "L": "K"} },
        ];

        tests.forEach((test): void => {
            it(test.orbit, function (): void {
                const map = new UniversalOrbitMap();
                const orbits = map.addOrbit(test.orbit);
                assert.deepEqual(orbits, test.result);
            });
        });
    });

    describe("countOrbits", function(): void {
        const tests = [
            { orbits: ["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L"], spaceObject: "D", result: 3 },
            { orbits: ["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L"], spaceObject: "L", result: 7 },
            { orbits: ["COM)B", "B)C", "C)D", "D)E", "E)F", "B)G", "G)H", "D)I", "E)J", "J)K", "K)L"], spaceObject: "COM", result: 0 },
        ];

        tests.forEach((test): void => {
            it(test.spaceObject, function(): void {
                const map = new UniversalOrbitMap();
                map.parseOrbits(test.orbits);
                const numOrbits = map.countOrbits(test.spaceObject);
                assert.equal(numOrbits, test.result);
            });
        });
    });
});