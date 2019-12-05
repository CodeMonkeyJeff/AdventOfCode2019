"use strict";

import { Opcode, ParameterMode } from "./Enum";

export class IntcodeMachine {
    public Tape: number[];
    private instructionPointer: number;

    public constructor(initialTape: number[]) {
        this.Tape = Array.from(initialTape);
        this.instructionPointer = 0;
    }

    public OPC(): number[] {
        const opcode = this.Tape[this.instructionPointer] % 100;    // Only right-most two digits are the opcode
        switch(opcode) {
            case Opcode.ADD:
                return this.ADD();
                break;
            case Opcode.MUL:
                return this.MUL();
                break;
            case Opcode.BRK:
                return this.BRK();
                break;
            default:
                throw new Error("Illegal OPCODE attempted execution");
                break;
        }
    }

    // Mainly a placeholder to check instruction calls
    private CheckOpcodeCall(expectedOpcode: Opcode): void { if ((this.Tape[this.instructionPointer]%100) != expectedOpcode) { throw new Error("Illegal call to " + expectedOpcode); } }

    private GetParameters(val: number): number {
        const mode: number = Math.floor(this.Tape[this.instructionPointer] / Math.pow(10, val + 1)) % 10;
        switch (mode) {
            case ParameterMode.Immediate:
                return this.Tape[this.instructionPointer + val];
                break;
            case ParameterMode.Position:
                return this.Tape[this.Tape[this.instructionPointer + val]];
                break;
            default:
                throw new Error("Illegal Parameter Mode");
                break;
        }
    }

    private ADD(): number[] {        
        this.CheckOpcodeCall(Opcode.ADD);

        const addends = [1, 2].map((val: number): number => this.GetParameters(val));
        const destination = this.Tape[this.instructionPointer + 3]  //! This should never be in immediate mode as per Day 5 instructions
        this.Tape[destination] = addends[0] + addends[1];

        this.instructionPointer += 4;
        return this.Tape;
    }

    private MUL(): number[] {
        this.CheckOpcodeCall(Opcode.MUL);

        const multiplicands = [1, 2].map((val: number): number => this.GetParameters(val));
        const destination = this.Tape[this.instructionPointer + 3]  //! This should never be in immediate mode as per Day 5 instructions
        this.Tape[destination] = multiplicands[0] * multiplicands[1];

        this.instructionPointer += 4;
        return this.Tape;
    }

    private BRK(): number[] {
        this.instructionPointer = this.Tape.length;
        return this.Tape;
    }


    public ExecuteTape(): number[] {
        while (this.instructionPointer < this.Tape.length) { this.Tape = this.OPC(); }
        return this.Tape;
    }
}