"use strict";

import { Opcode, ParameterMode } from "./Enum";
import { IntcodeMachineOptions } from "./Types";

export class IntcodeMachine {
    public Tape: number[];
    private readonly _initialTape: number[];
    private _instructionPointer: number;
    private readonly _options: IntcodeMachineOptions;
    public InputValues: number[];
    public readonly OutputValues: number[];
    public readonly BreakOnOutput: boolean;

    public constructor(initialTape: number[], options: Partial<IntcodeMachineOptions> = {}) {
        this._initialTape = initialTape;
        this.Tape = Array.from(initialTape);
        this._instructionPointer = 0;
        this._options = Object.assign({
            InputValues: new Array<number>(),
            VerboseMode: false,
            SilentMode: false,
            BreakOnOutput: false,
        }, options);

        this.InputValues = this._options.InputValues;
        this.OutputValues = new Array<number>();
        this.BreakOnOutput = this._options.BreakOnOutput;
    }

    public get CurrentInstruction(): number { return this.Tape[this._instructionPointer] % 100; }

    public OPC(): IntcodeMachine {
        // const opcode = this.Tape[this._instructionPointer] % 100;    // Only right-most two digits are the opcode
        switch(this.CurrentInstruction) {
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

    private CheckOpcodeCall(expectedOpcode: Opcode): void { if (this.CurrentInstruction != expectedOpcode) { throw new Error("Illegal call to " + expectedOpcode); } }

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

    private ADD(): IntcodeMachine {        
        this.CheckOpcodeCall(Opcode.ADD);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " ADD "); }

        const addends = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = addends[0] + addends[1];

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private MUL(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.MUL);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " MUL "); }

        const multiplicands = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = multiplicands[0] * multiplicands[1];

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private BRK(): IntcodeMachine {
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " BRK "); }
        if (this._options.VerboseMode) { console.log(); }

        // this._instructionPointer += 1;       // If BRK is executed, keep PS idempotent so repeated execution breaks as well
        // return this;
        return null;
    }

    private INP(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.INP);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " INP "); }

        // Spec says to take this from the command line, but ain't nobody got time for that.
        if (this._options.VerboseMode) { process.stdout.write(" &" + this.Tape[this._instructionPointer + 1]); }
        const destination = this.Tape[this._instructionPointer + 1];

        if (this.InputValues.length == 0) { throw new Error("Did not specify an input value!"); }
        const input = this.InputValues.shift();
        if (this._options.VerboseMode) { process.stdout.write(" <== #" + input); }
        this.Tape[destination] = input;

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 2;
        return this;
    }

    private OUT(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.OUT);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " OUT "); }
        const value = this.GetParameters(1);

        this.OutputValues.push(value);       // For easy retrieval later
        if (!this._options.SilentMode) { console.log(" ==> #" + value.toString()); }
        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 2;

        if (this._options.BreakOnOutput) { return null; } else { return this; }
        // return this;
    }

    private JIT(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.JIT);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " JIT "); }        
        const conditional = this.GetParameters(1);
        const jumpAddress = this.GetParameters(2);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional != 0 ? jumpAddress : this._instructionPointer + 3;
        return this;
    }

    private JIF(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.JIF);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " JIF "); }
        const conditional = this.GetParameters(1);
        const jumpAddress = this.GetParameters(2);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional == 0 ? jumpAddress : this._instructionPointer + 3;
        return this;
    }

    private LNE(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.LNE);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " LNE "); }        

        const comparators = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = comparators[0] < comparators[1] ? 1 : 0;

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private EQU(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.EQU);
        if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " EQU "); }        

        const comparators = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        this.Tape[destination] = comparators[0] == comparators[1] ? 1 : 0;

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    public ExecuteTape(): IntcodeMachine {
        let shouldBreak = false;
        while (!shouldBreak) { shouldBreak = this.OPC() === null; }
        return this;
    }
}