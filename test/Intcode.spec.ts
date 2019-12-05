"use strict";

import assert = require("assert");
import { IntcodeMachine } from "../src/IntCodeMachine";

describe("Day 2 -- Intcode", function (): void {
    describe("ADD", function (): void {
        const tests = [
            { tape: [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50], result: [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50] },
            { tape: [1, 9, 10, 0, 1, 9, 10, 3, 99, 30, 40], result: [70, 9, 10, 0, 1, 9, 10, 3, 99, 30, 40] },
            { tape: [1101, 100, -1, 4, 0], result: [1101, 100, -1, 4, 99] }
        ];

        tests.forEach((test): void => {
            it(test.tape.join(", "), function() {
                const machine = new IntcodeMachine(test.tape);
                const result = machine.OPC();
                assert.deepEqual(result, test.result);
            });
        });
    });

    describe("MUL", function(): void {
        const tests = [
            { tape: [2, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50], result: [2, 9, 10, 1200, 2, 3, 11, 0, 99, 30, 40, 50] },
            { tape: [2, 9, 10, 0, 1, 9, 10, 3, 99, 30, 40], result: [1200, 9, 10, 0, 1, 9, 10, 3, 99, 30, 40] },
            { tape: [1102, 33, 3, 4, 0], result: [1102, 33, 3, 4, 99] }
        ];

        tests.forEach((test): void => {
            it(test.tape.join(", "), function() {
                const machine = new IntcodeMachine(test.tape);
                const result = machine.OPC();
                assert.deepEqual(result, test.result);
            });
        });
    });

    describe("BRK", function(): void {
        const tests = [
            { tape: [99, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]},
            { tape: [99, 9, 10, 3, 2, 9, 10, 0, 99, 30, 40]}
        ];

        tests.forEach((test): void => {
            it(test.tape.join(", "), function() {
                const machine = new IntcodeMachine(test.tape);
                const result = machine.OPC();
                assert.deepEqual(result, test.tape);
            });
        });
    });

    describe("ExecuteTape", function(): void {
        const tests = [
            { tape: [1, 0, 0, 0, 99], result: [2, 0, 0, 0, 99] },
            { tape: [2, 3, 0, 3, 99], result: [2, 3, 0, 6, 99] },
            { tape: [2, 4, 4, 5, 99, 0], result: [2, 4, 4, 5, 99, 9801] },
            { tape: [1, 1, 1, 4, 99, 5, 6, 0, 99], result: [30, 1, 1, 4, 2, 5, 6, 0, 99] },
            { tape: [1101, 100, -1, 4, 0], result: [1101, 100, -1, 4, 99] },
            { tape: [1102, 33, 3, 4, 0], result: [1102, 33, 3, 4, 99] }
        ];

        tests.forEach((test): void => {
            it(test.tape.join(", "), function() {
                const result = new IntcodeMachine(test.tape).ExecuteTape();
                assert.deepEqual(result, test.result);
            });
        });
    });
});