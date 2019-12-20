"use strict";

import assert = require("assert");
import { MonitoringStation } from "../src/MonitoringStation";

// const maps: Array<string[]> = new Array<string[]>();
const maps: { [name: string]: string[] } = {}
maps["17x5"] = [".#....#####...#..", "##...##.#####..##", "##...#...#.#####.", "..#.....X...###..", "..#.#.....#....##"];
maps["20x20"] = [".#..##.###...#######", "##.############..##.", ".#.######.########.#", ".###.#######.####.#.", "#####.##.#.##.###.##", "..#####..#.#########", "####################", "#.####....###.#.#.##", "##.#################", "#####.##.###..####..", "..######..##.#######", "####.##.####...##..#", ".#####..#.######.###", "##...#.##########...", "#.##########.#######", ".####.#.###.###.#.##", "....##.##.###..#####", ".#.#.###########.###", "#.#.#.#####.####.###", "###.##.####.##.#..##"];

describe("Day 10 -- Monitoring Station", function() {

    describe("Import Map", function() {
        const tests = [
            { map: [".#..#", ".....", "#####", "....#", "...##"], result: [
                { x: 1, y: 0 }, { x: 4, y: 0 }, 
                { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, 
                { x: 4, y: 3 }, 
                { x: 3, y: 4 }, { x: 4, y: 4 }] }
        ];

        tests.forEach((test, index): void => {
            it("Test " + index, function() {
                const points = MonitoringStation.ReadPoints(test.map);
                assert.deepEqual(points, test.result);
            });
        });
    });

    describe("GetViewableAsteroids", function() {
        const tests = [
            { map: [".#..#", ".....", "#####", "....#", "...##"], name: { x: 3, y: 4 }, result: 8 },
            { map: [".#..#", ".....", "#####", "....#", "...##"], name: { x: 1, y: 0 }, result: 7 },
            { map: [".#..#", ".....", "#####", "....#", "...##"], name: { x: 2, y: 2 }, result: 7 },
            { map: ["......#.#.", "#..#.#....", "..#######.", ".#.#.###..", ".#..#.....", "..#....#.#", "#..#....#.", ".##.#..###", "##...#..#.", ".#....####"], name: { x: 5, y: 8 }, result: 33 },
            { map: ["#.#...#.#.", ".###....#.", ".#....#...", "##.#.#.#.#", "....#.#.#.", ".##..###.#", "..#...##..", "..##....##", "......#...", ".####.###."], name: { x: 1, y: 2 }, result: 35 },
            { map: maps["20x20"], name: {x:11, y:13}, result: 210 }
        ];

        tests.forEach((test): void => {            
            it(MonitoringStation.GetName(test.name), function() {
                const station = new MonitoringStation(test.map);
                const result = station.GetViewableAsteroids(test.name).length;
                assert.equal(result, test.result);
            });
        });
    });

    describe("GetNthVaporizedAsteroid", function() {
        const tests = [
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 1, result: { x: 11, y: 12 } },
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 2, result: { x: 12, y: 1 } },
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 3, result: { x: 12, y: 2 } },
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 10, result: { x: 12, y: 8 } },
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 20, result: { x: 16, y: 0 } },
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 50, result: { x: 16, y: 9 } },
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 100, result: { x: 10, y: 16 } },

            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 199, result: { x: 9, y: 6 } },      // 7
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 200, result: { x: 8, y: 2 } },      // 8
            { map: maps["20x20"], baseStation: { x: 11, y: 13 }, N: 201, result: { x: 10, y: 9 } },     // 9

            { map: maps["17x5"], baseStation: { x: 8, y: 3 }, N: 1, result: { x: 8, y: 1 } },
            { map: maps["17x5"], baseStation: { x: 8, y: 3 }, N: 2, result: { x: 9, y: 0 } },
            { map: maps["17x5"], baseStation: { x: 8, y: 3 }, N: 3, result: { x: 9, y: 1 } },
            { map: maps["17x5"], baseStation: { x: 8, y: 3 }, N: 4, result: { x: 10, y: 0 } },
            { map: maps["17x5"], baseStation: { x: 8, y: 3 }, N: 5, result: { x: 9, y: 2 } }
        ];

        tests.forEach((test, index): void => {
            it("Test " + index, function(): void {
                const station = new MonitoringStation(test.map);
                const result = station.GetNthVaporizedAsteroid(test.baseStation, test.N);
                assert.deepEqual(result, test.result);
            });
        });
    });
});