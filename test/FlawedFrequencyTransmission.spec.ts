"use strict";

import assert = require("assert");
import { FlawedFrequencyTransmission } from "../src/FlawedFrequencyTransmission";

describe("Day 16 -- FlawedFrequencyTransmission", function(): void {
    describe("ConvertInputSignal", function (): void {
        const tests = [
            { signal: "12345", result: [1, 2, 3, 4, 5] },
            { signal: "123456", result: [1, 2, 3, 4, 5, 6] },
            { signal: "1234567890123456", result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6] },
            { signal: "80871224585914546619083218645595", result: [8, 0, 8, 7, 1, 2, 2, 4, 5, 8, 5, 9, 1, 4, 5, 4, 6, 6, 1, 9, 0, 8, 3, 2, 1, 8, 6, 4, 5, 5, 9, 5] },
            { signal: "1", result: [1] }
        ];

        tests.forEach((test): void => {
            it(test.signal.toString(), function() {
                const result = FlawedFrequencyTransmission.ConvertInputSignal(test.signal);
                assert.deepEqual(result, test.result);
            });
        });
    });
    describe("RepeatSignal", function(): void {
        const tests = [
            { signal: "1234567890", numRepetitions: 10, result: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0] }
        ];

        tests.forEach((test): void => {
            it(test.numRepetitions.toString(), function() {
                const partialSignal = FlawedFrequencyTransmission.ConvertInputSignal(test.signal);
                const signal = FlawedFrequencyTransmission.RepeatSignal(partialSignal,test.numRepetitions);
                assert.deepEqual(signal, test.result);
            });
        });
    });

    describe("ExecutePhase", function(): void {
        const tests = [
            { signal: "12345678", result: [4, 8, 2, 2, 6, 1, 5, 8] },
            { signal: "48226158", result: [3, 4, 0, 4, 0, 4, 3, 8] },
            { signal: "34040438", result: [0, 3, 4, 1, 5, 5, 1, 8] }
        ];

        tests.forEach((test): void => {
            it(test.signal.toString(), function(): void {
                const signal = FlawedFrequencyTransmission.ConvertInputSignal(test.signal);
                const fft = new FlawedFrequencyTransmission(signal);
                const result = fft.ExecutePhase();
                assert.deepEqual(result, test.result);
            });
        });
    });
});