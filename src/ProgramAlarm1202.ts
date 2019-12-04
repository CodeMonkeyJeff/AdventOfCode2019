"use strict";

import { IntcodeMachine } from "./IntCodeMachine";

export class ProgramAlarm1202 {
    private static readonly _input = [1, 0, 0, 3, 1, 1, 2, 3, 1, 3, 4, 3, 1, 5, 0, 3, 2, 1, 9, 19, 1, 5, 19, 23, 1, 6, 23, 27, 1, 27, 10, 31, 1, 31, 5, 35, 2, 10, 35, 39, 1, 9, 39, 43, 1, 43, 5, 47, 1, 47, 6, 51, 2, 51, 6, 55, 1, 13, 55, 59, 2, 6, 59, 63, 1, 63, 5, 67, 2, 10, 67, 71, 1, 9, 71, 75, 1, 75, 13, 79, 1, 10, 79, 83, 2, 83, 13, 87, 1, 87, 6, 91, 1, 5, 91, 95, 2, 95, 9, 99, 1, 5, 99, 103, 1, 103, 6, 107, 2, 107, 13, 111, 1, 111, 10, 115, 2, 10, 115, 119, 1, 9, 119, 123, 1, 123, 9, 127, 1, 13, 127, 131, 2, 10, 131, 135, 1, 135, 5, 139, 1, 2, 139, 143, 1, 143, 5, 0, 99, 2, 0, 14, 0];

    public static Day2Part1(): string {
        const tape = ProgramAlarm1202.GetTestMachine(12, 2);
        return tape.ExecuteTape()[0].toString(); 
    }

    public static Day2Part2(): string {
        const goal = 19690720;
        const inputs = { noun: 0, verb: 0 };

        while (inputs.noun <= 99) {
            while (inputs.verb <= 99) {
                const tape = ProgramAlarm1202.GetTestMachine(inputs.noun, inputs.verb);
                const output: number = tape.ExecuteTape()[0];
                if (output == goal) { return ProgramAlarm1202.CalculateSubmission(inputs.noun, inputs.verb).toString(); }
                inputs.verb++;
            }
            inputs.verb = 0;
            inputs.noun++;
        }

        throw new Error("Never reached goal value");
    }

    private static CalculateSubmission(noun: number, verb: number): number {
        return (100 * noun) + verb;
    }

    private static GetTestMachine(noun: number, verb: number): IntcodeMachine {
        const tape = new IntcodeMachine(ProgramAlarm1202._input);
        tape.Tape[1] = noun;
        tape.Tape[2] = verb;
        return tape;
    }
}