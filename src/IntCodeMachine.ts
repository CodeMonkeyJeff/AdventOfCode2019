"use strict";

import { Opcode, ParameterMode } from "./Enum";
import { IntcodeMachineOptions } from "./Types";

export class IntcodeMachine {
    public Tape: number[];
    private _instructionPointer: number;
    private _options: IntcodeMachineOptions;

    public constructor(initialTape: number[], options: Partial<IntcodeMachineOptions> = {}) {
        this.Tape = Array.from(initialTape);
        this._instructionPointer = 0;
        this._options = Object.assign({
            InputValues: new Array<number>(),
            VerboseMode: false,
            SilentMode: false,
        }, options);
    }

    public OPC(): number[] {
        const opcode = this.Tape[this._instructionPointer] % 100;    // Only right-most two digits are the opcode
        switch(opcode) {
            case Opcode.ADD:
                return this.ADD();
                break;
            case Opcode.MUL:
                return this.MUL();
                break;
            case Opcode.INP:
                return this.INP();
                break;
            case Opcode.OUT:
                return this.OUT();
                break
            case Opcode.JIT:
                return this.JIT();
                break;
            case Opcode.JIF:
                return this.JIF();
                break;
            case Opcode.LNE:
                return this.LNE();
                break;
            case Opcode.EQU:
                return this.EQU();
                break;
            case Opcode.BRK:
                return this.BRK();
                break;
            default:
                throw new Error("Illegal OPCODE attempted execution");
                break;
        }
    }

    private CheckOpcodeCall(expectedOpcode: Opcode): void { if ((this.Tape[this._instructionPointer]%100) != expectedOpcode) { throw new Error("Illegal call to " + expectedOpcode); } }

    private GetParameters(val: number): number {
        const mode: number = Math.floor(this.Tape[this._instructionPointer] / Math.pow(10, val + 1)) % 10;
        const addr = this._instructionPointer + val;
        switch (mode) {
            case ParameterMode.Immediate:
                if (this._options.VerboseMode) { process.stdout.write("#" + this.Tape[addr] + " "); }
                return this.Tape[addr];
                break;
            case ParameterMode.Position:
                if (this._options.VerboseMode) { process.stdout.write("&" + this.Tape[addr] + " "); }
                return this.Tape[this.Tape[addr]];
                break;
            default:
                throw new Error("Illegal Parameter Mode");
                break;
        }
    }

    private ADD(): number[] {        
        this.CheckOpcodeCall(Opcode.ADD);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " ADD "); }

        const addends = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = addends[0] + addends[1];

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this.Tape;
    }

    private MUL(): number[] {
        this.CheckOpcodeCall(Opcode.MUL);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " MUL "); }

        const multiplicands = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = multiplicands[0] * multiplicands[1];

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this.Tape;
    }

    private BRK(): number[] {
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " BRK "); }
        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = this.Tape.length;
        return this.Tape;
    }

    private INP(): number[] {
        this.CheckOpcodeCall(Opcode.INP);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " INP "); }

        // Spec says to take this from the command line, but ain't nobody got time for that.
        if (this._options.VerboseMode) { process.stdout.write(" &" + this.Tape[this._instructionPointer + 1]); }
        const destination = this.Tape[this._instructionPointer + 1];

        const input = this._options.InputValues.shift();
        if (this._options.VerboseMode) { process.stdout.write(" <== #" + input); }
        this.Tape[destination] = input;

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 2;
        return this.Tape;
    }

    private OUT(): number[] {
        this.CheckOpcodeCall(Opcode.OUT);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " OUT "); }
        const value = this.GetParameters(1);

        if (!this._options.SilentMode) { console.log(" ==> #" + value.toString()); }
        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 2;
        return this.Tape;
    }

    private JIT(): number[] {
        this.CheckOpcodeCall(Opcode.JIT);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " JIT "); }        
        const conditional = this.GetParameters(1);
        const jumpAddress = this.GetParameters(2);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional != 0 ? jumpAddress : this._instructionPointer + 3;
        return this.Tape;
    }

    private JIF(): number[] {
        this.CheckOpcodeCall(Opcode.JIF);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " JIF "); }
        const conditional = this.GetParameters(1);
        const jumpAddress = this.GetParameters(2);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional == 0 ? jumpAddress : this._instructionPointer + 3;
        return this.Tape;
    }

    private LNE(): number[] {
        this.CheckOpcodeCall(Opcode.LNE);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " LNE "); }        

        const comparators = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = comparators[0] < comparators[1] ? 1 : 0;

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this.Tape;
    }

    private EQU(): number[] {
        this.CheckOpcodeCall(Opcode.EQU);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " EQU "); }        

        const comparators = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = comparators[0] == comparators[1] ? 1 : 0;

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this.Tape;
    }

    public ExecuteTape(): number[] {
        while (this._instructionPointer < this.Tape.length) { 
            this.Tape = this.OPC(); 
        }
        return this.Tape;
    }
}