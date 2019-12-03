"use strict";

import { Opcode } from "./Enum";

export class IntcodeMachine {
    // private readonly _initialTape: number[];
    public Tape: number[];
    private instructionPointer: number;

    // public get Tape(): number[] { return this._tape; }
    // public set Tape(value: number[]) { this._tape = value; }

    public constructor(initialTape: number[]) {
        // this._initialTape = initialTape;
        this.Tape = Array.from(initialTape);
        this.instructionPointer = 0;
    }

    public static OPC(tape: number[], pointer: number): number[] {
        const opcode = tape[pointer];

        switch(opcode) {
            case Opcode.ADD:
                return this.ADD(tape, pointer);
                break;
            case Opcode.MUL:
                return this.MUL(tape, pointer);
                break;
            case Opcode.BRK:
                return tape;
                break;
            default:
                throw new Error("Illegal OPCODE at position " + pointer + " for tape " + tape.join(", "));
                break;
        }
    }

    private static ADD(tape: number[], pointer: number): number[] {
        const opcode = tape[pointer];
        if (opcode != Opcode.ADD) { throw new Error("Bad OPCODE in ADD method"); }

        const position1 = tape[pointer + 1];
        const position2 = tape[pointer + 2];
        const destination = tape[pointer + 3];

        const result = tape[position1] + tape[position2];
        tape[destination] = result;
        return tape;
    }

    private static MUL(tape: number[], pointer: number): number[] {
        const opcode = tape[pointer];
        if (opcode != Opcode.MUL) { throw new Error("Bad OPCODE in MUL method"); }

        const position1 = tape[pointer + 1];
        const position2 = tape[pointer + 2];
        const destination = tape[pointer + 3];

        const result = tape[position1] * tape[position2];
        tape[destination] = result;
        return tape;
    }

    public ExecuteTape(): number[] {
        let position = 0;
        while (position < this.Tape.length) {
            this.Tape = IntcodeMachine.OPC(this.Tape, position);

            if (this.Tape[position] != 99) {                
                position += IntcodeMachine.GetNumberOfBytes(this.Tape[position]);
            } else {
                position = this.Tape.length;
            }
        }

        return this.Tape;
    }
    
    public static GetNumberOfBytes(opcode: Opcode): number {
        switch (opcode) {
            case Opcode.ADD:
            case Opcode.MUL:
                return 4;
                break;
            case Opcode.BRK:
                return 1;
                break;
            default:
                throw new Error("Illegal OPCODE");
                break;
        }
    }
}