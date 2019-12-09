"use strict";

import assert = require("assert");
import { SpaceImageFormat } from "../src/SpaceImageFormat";

describe("Day 8 -- SpaceImageFormat", function() {
    describe("Constructor", function() {
        const tests = [
            { data: "123456789012", result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2] }
        ];

        tests.forEach((test): void => {
            it(test.data, function(): void {
                const image = new SpaceImageFormat(test.data);
                assert.deepEqual(image.data, test.result);
            })
        });
    });

    describe("SplitIntoLayers", function() {
        const tests = [
            { data: "123456789012", dx: 3, dy: 2, result: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 0, 1, 2]] },
            { data: "123456789013", dx: 2, dy: 3, result: [[1, 2, 3, 4, 5, 6], [7, 8, 9, 0, 1, 3]] },
            { data: "123456789014", dx: 4, dy: 3, result: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 4]] }
        ];

        tests.forEach((test): void => {
            it(test.data, function(): void {
                const image = new SpaceImageFormat(test.data);
                image.SetDimensions(test.dx, test.dy);
                const layers = image.SplitIntoLayers();
                assert.deepEqual(layers, test.result);
            })
        });
    });

    describe("FlattenImage", function() {
        const tests = [
            { data: "0222112222120000", dx: 2, dy: 2, result: [0, 1, 1, 0] }
        ];

        tests.forEach((test): void => {
            it(test.data, function(): void {
                const image = new SpaceImageFormat(test.data);
                image.SetDimensions(test.dx, test.dy);
                const result = image.FlattenImage();
                assert.deepEqual(result, test.result);
            });
        });
    });
});