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

    describe("GetPattern", function(): void {
        const tests = [
            { index: 0, length: 32, result: { positives: [0, 4, 8, 12, 16, 20, 24, 28], negatives: [2, 6, 10, 14, 18, 22, 26, 30] } },
            { index: 1, length: 32, result: { positives: [1, 2, 9, 10, 17, 18, 25, 26], negatives: [5, 6, 13, 14, 21, 22, 29, 30] } },
            { index: 2, length: 32, result: { positives: [2, 3, 4, 14, 15, 16, 26, 27, 28], negatives: [8, 9, 10, 20, 21, 22] } },
            { index: 6, length: 32, result: { positives: [6, 7, 8, 9, 10, 11, 12], negatives: [20, 21, 22, 23, 24, 25, 26] } }
        ];

        tests.forEach((test): void => {
            it(test.index.toString(), function() {
                const pattern = FlawedFrequencyTransmission.GetPattern(test.index, test.length);
                assert.deepEqual(pattern.positives, test.result.positives);
                assert.deepEqual(pattern.negatives, test.result.negatives);
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

    // describe("ExecuteMultiplePhases", function(): void {
    //     const tests = [
    //         { signal: "12345678", numPhases: 4, result: [0, 1, 0, 2, 9, 4, 9, 8] },
    //         { signal: "80871224585914546619083218645595", numPhases: 100, result: [2, 4, 1, 7, 6, 1, 7, 6] },
    //         { signal: "19617804207202209144916044189917", numPhases: 100, result: [7, 3, 7, 4, 5, 4, 1, 8] },
    //         { signal: "69317163492948606335995924319873", numPhases: 100, result: [5, 2, 4, 3, 2, 1, 3, 3] }
    //     ];

    //     tests.forEach((test): void => {
    //         it(test.signal.toString(), function(): void {
    //             const signal = FlawedFrequencyTransmission.ConvertInputSignal(test.signal);
    //             const result = FlawedFrequencyTransmission.ExecuteMultiplePhases(signal, test.numPhases).slice(0, 8);
    //             assert.deepEqual(result, test.result);
    //         });
    //     });
    // });

    // describe("NextAttempt", function(): void {
    //     const tests = [
    //         { signal: "03036732577212944063491565474664", result: "84462026", useOffset: true },
    //         { signal: "02935109699940807407585447034323", result: "78725270", useOffset: true },
    //         { signal: "03081770884921959731165446850517", result: "53553731", useOffset: true }
    //     ];

    //     tests.forEach((test): void => {
    //         it(test.signal.toString(), function(): void {
    //             const signal = FlawedFrequencyTransmission.ConvertInputSignal(test.signal);
    //             // const result = FlawedFrequencyTransmission.CalculateOutput(signal);
    //             const result = FlawedFrequencyTransmission.NextAttempt(signal, test.useOffset);
    //             assert.equal(result, test.result);
    //         });
    //     });
    // });
});