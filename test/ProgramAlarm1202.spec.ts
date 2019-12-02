"use strict";

import assert = require("assert");
import { ProgramAlarm1202 } from "../src/ProgramAlarm1202";

describe("Day 2 -- ProgramAlarm1202", function (): void {
    describe("ADD", function (): void {
        const tests = [
            { tape: [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50], position: 0, result: [1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50] },
            { tape: [1, 9, 10, 3, 2, 1, 10, 11, 0, 99, 30, 40], position: 4, result: [70, 9, 10, 3, 2, 1, 10, 11, 0, 99, 30, 40] }
        ];

        tests.forEach((test): void => {
            it(test.tape.join(", "), function() {
                const tape = ProgramAlarm1202.ADD(test.tape, test.position);
                assert.strictEqual(tape, test.result);
            });
        });
    });

    describe("MUL", function(): void {
        const tests = [
            { tape: [1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50], position: 0, result: [1, 9, 10, 200, 2, 3, 11, 0, 99, 30, 40, 50] },
            { tape: [1, 9, 10, 3, 2, 1, 10, 11, 0, 99, 30, 40], position: 4, result: [200, 9, 10, 3, 2, 1, 10, 11, 0, 99, 30, 40] }
        ];

        tests.forEach((test): void => {
            it(test.tape.join(", "), function() {
                const tape = ProgramAlarm1202.ADD(test.tape, test.position);
                assert.strictEqual(tape, test.result);
            });
        });
    });
});