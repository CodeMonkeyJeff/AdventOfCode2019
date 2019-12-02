"use strict";

export class ProgramAlarm1202 {

    public static OPC(tape: number[], pointer: number): number[] {
        const opcode = tape[pointer];

        switch(opcode) {
            case 1:
                return this.ADD(tape, pointer);
                break;
            case 2:
                return this.MUL(tape, pointer);
                break;
            case 99:
                return tape;
                break;
            default:
                throw new Error("Illegal OPCODE");
                break;
        }
    }

    public static ADD(tape: number[], pointer: number): number[] {
        // TODO:  check for seg faults?
        const position1 = tape[pointer + 1];
        const position2 = tape[pointer + 2];
        const destination = tape[pointer + 3];

        const result = tape[position1] + tape[position2];
        tape[destination] = result;
        return tape;
    }

    public static MUL(tape: number[], pointer: number): number[] {
        // TODO:  check for seg faults?
        const position1 = tape[pointer + 1];
        const position2 = tape[pointer + 2];
        const destination = tape[pointer + 3];

        const result = tape[position1] * tape[position2];
        tape[destination] = result;
        return tape;
    }
}