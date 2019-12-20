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
                const machine = new IntcodeMachine(test.tape.map((val: number): bigint => BigInt(val)), { SilentMode: true });
                const result = machine.OPC();
                assert.deepEqual(result.Tape, test.result);
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
                const machine = new IntcodeMachine(test.tape.map((val: number): bigint => BigInt(val)), { SilentMode: true });
                const result = machine.OPC();
                assert.deepEqual(result.Tape, test.result);
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
                const machine = new IntcodeMachine(test.tape.map((val: number): bigint => BigInt(val)), { SilentMode: true }).ExecuteTape();
                assert.deepEqual(machine.Tape, test.tape);
            });
        });
    });
    
    describe("AdventOfCode Tests", function(): void {
        const tests = [
            { tape: [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9, 1], inputs: [1],result: 1 },
            { tape: [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9, 2], inputs: [0], result: 0 },
            { tape: [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1, 1], inputs: [1],  result: 1 },
            { tape: [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1, 2], inputs: [0],  result: 0 },                        
            { tape: [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8, 1], inputs: [8],  result: 1 },
            { tape: [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8, 2], inputs: [1],  result: 0 },
            { tape: [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8, 1], inputs: [1],  result: 1 },
            { tape: [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8, 2], inputs: [9],  result: 0 },
            { tape: [3, 3, 1108, -1, 8, 3, 4, 3, 99, 1], inputs: [8], result: 1 },
            { tape: [3, 3, 1108, -1, 8, 3, 4, 3, 99, 2], inputs: [1], result: 0 },
            { tape: [3, 3, 1107, -1, 8, 3, 4, 3, 99, 1], inputs: [1], result: 1 },
            { tape: [3, 3, 1107, -1, 8, 3, 4, 3, 99, 2], inputs: [9], result: 0 },            
            { tape: [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99, 2], inputs: [8], position: 20, result: 1000 },
            { tape: [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99, 3], inputs: [9], position: 20, result: 1001 },
            { tape: [104, 1123899906842624, 99], inputs: [], result: 1123899906842624 },
            { tape: [1102,34915192,34915192,7,4,7,99,0], inputs: [], result: 1219070632396864 }
        ];

        tests.forEach((test): void => {
            it (test.tape.join(", "), function() {
                const machine = new IntcodeMachine(test.tape.map((val: number): bigint => BigInt(val)), { InputValues: test.inputs.map((val: number): bigint => BigInt(val)), SilentMode: true }).ExecuteTape();
                const result = machine.OutputValues[0];
                assert.equal(result, test.result);
            });
        });
    });

    describe("ExecuteTape", function(): void {
        const tests = [
            // { tape: [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99], result: [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99] },

            { tape: [1, 0, 0, 0, 99], result: [2, 0, 0, 0, 99] },
            { tape: [2, 3, 0, 3, 99], result: [2, 3, 0, 6, 99] },
            { tape: [2, 4, 4, 5, 99, 0], result: [2, 4, 4, 5, 99, 9801] },
            { tape: [1, 1, 1, 4, 99, 5, 6, 0, 99], result: [30, 1, 1, 4, 2, 5, 6, 0, 99] },
            { tape: [1101, 100, -1, 4, 0], result: [1101, 100, -1, 4, 99] },
            { tape: [1102, 33, 3, 4, 0], result: [1102, 33, 3, 4, 99] },
            { tape: [1102, 34463338, 34463338, 3, 99], result: [1102, 34463338, 34463338, 1187721666102244n, 99] }            
        ];

        tests.forEach((test): void => {
            it(test.tape.join(", "), function() {
                const result = new IntcodeMachine(test.tape.map((val: number): bigint => BigInt(val)), {SilentMode: true}).ExecuteTape();
                assert.deepEqual(result.Tape, test.result);
            });
        });
    });
});