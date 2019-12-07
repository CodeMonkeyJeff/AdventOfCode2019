"use strict";

import assert = require("assert");
import { AmplificationCircuit } from "../src/AmplificationCircuit";

describe("Day 7 -- AmplificationCircuit", function() {
    describe("CalculateThrust", function() {
        const tests = [
            { AmpCode: [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], phaseSettings: [4, 3, 2, 1, 0], result: 43210 },
            { AmpCode: [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0], phaseSettings: [0, 1, 2, 3, 4], result: 54321 },
            { AmpCode: [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0], phaseSettings: [1, 0, 4, 3, 2], result: 65210 }
        ];

        tests.forEach((test): void => {
            it(test.AmpCode.join(", "), function(): void {
                const circuit = new AmplificationCircuit(test.AmpCode);
                const result = circuit.CalculateThrust(test.phaseSettings);
                assert.equal(result, test.result);
            });
        });
    });

    describe("GetMaxPhaseSettingSequence", function() {
        const tests = [
            { AmpCode: [3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], result: [4, 3, 2, 1, 0]},
            { AmpCode: [3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0], result: [0, 1, 2, 3, 4]},
            { AmpCode: [3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0], result: [1, 0, 4, 3, 2] }
        ];

        tests.forEach((test): void => {
            it(test.AmpCode.join(", "), function(): void {
                const circuit = new AmplificationCircuit(test.AmpCode);
                const result = circuit.GetMaxPhaseSettingSequence();
                assert.deepEqual(result, test.result);
            });
        });
    });
});