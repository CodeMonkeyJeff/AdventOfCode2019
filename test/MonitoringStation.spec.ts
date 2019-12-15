"use strict";

import assert = require("assert");
import { MonitoringStation } from "../src/MonitoringStation";

describe("Day 10 -- Monitoring Station", function() {

    describe("Import Map", function() {
        const tests = [
            { map: [".#..#", ".....", "#####", "....#", "...##"], result: [
                { x: 1, y: 0 }, { x: 4, y: 0 }, 
                { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 }, 
                { x: 4, y: 3 }, 
                { x: 3, y: 4 }, { x: 4, y: 4 }] }
        ];

        tests.forEach((test): void => {
            it(test.map.join(), function() {
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
            { map: ["#.#...#.#.", ".###....#.", ".#....#...", "##.#.#.#.#", "....#.#.#.", ".##..###.#", "..#...##..", "..##....##", "......#...", ".####.###."], name: { x: 1, y: 2 }, result: 35 }
        ];

        tests.forEach((test): void => {            
            it(MonitoringStation.GetName(test.name), function() {
                const station = new MonitoringStation(test.map);
                const result = station.GetViewableAsteroids(test.name);
                assert.equal(result, test.result);
            });
        });
    });
});