"use strict";

import { Opcode, ParameterMode } from "./Enum";
import { IntcodeMachineOptions } from "./Types";

export class IntcodeMachine {
    public Tape: number[];
    public InputValues: number[];
    public readonly OutputValues: number[];
    public readonly BreakOnOutput: boolean;

    private _instructionPointer: number;
    private readonly _initialTape: number[];
    private readonly _options: IntcodeMachineOptions;
    private _relativeBase: number;

    public constructor(initialTape: number[], options: Partial<IntcodeMachineOptions> = {}) {
        this._initialTape = initialTape;
        this.Tape = Array.from(initialTape);
        this._instructionPointer = 0;
        this._relativeBase = 0;
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
            case Opcode.ARB:
                return this.ARB();
                break;
            default:
                throw new Error("Illegal OPCODE attempted execution");
                break;
        }
    }

    // TODO:  Big number support
    // TODO:  Update verbose strings to leverage this static method
    private WriteVerbose(message: string, outputProgramCounter = true): void { 
        if (this._options.VerboseMode) {
            if (outputProgramCounter) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " "); }
            process.stdout.write(message + " "); 
        } 
    }

    private WriteDestination(destination: number, value: number): IntcodeMachine {
        // if (this.Tape.length < destination) {            
        //     const extArray: number[] = new Array(destination - this.Tape.length).fill(0);
        //     this.Tape.push(...extArray);
        // }

        this.ExtendTape(destination);
        this.Tape[destination] = value;
        return this;
    }

    private CheckOpcodeCall(expectedOpcode: Opcode): void { if (this.CurrentInstruction != expectedOpcode) { throw new Error("Illegal call to " + expectedOpcode); } }

    private GetParameters(position: number): number {
        const mode: number = Math.floor(this.Tape[this._instructionPointer] / Math.pow(10, position + 1)) % 10;
        const addr = this._instructionPointer + position;
        this.ExtendTape(addr);
        switch (mode) {            
            case ParameterMode.Position:                
                this.WriteVerbose("&" + this.Tape[addr].toString(), false);
                this.ExtendTape(this.Tape[addr]);
                return this.Tape[this.Tape[addr]];
                break;
            case ParameterMode.Immediate:
                this.WriteVerbose("#" + this.Tape[addr].toString(), false);
                return this.Tape[addr];
                break;
            case ParameterMode.Relative:
                    this.WriteVerbose(this.Tape[addr].toString() + ", " + this._relativeBase.toString(), false);
                    return this.Tape[this.Tape[addr]] + this._relativeBase;
                break;
            default:
                throw new Error("Parameter Mode is Illegal or Not Implemented");
                break;
        }
    }

    private ExtendTape (destination: number): void {
        if (this.Tape.length < destination) {            
            const extArray: number[] = new Array(destination - this.Tape.length).fill(0);
            this.Tape.push(...extArray);
        }
    }

    private ADD(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.ADD);
        // if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " ADD "); }
        this.WriteVerbose("ADD");

        const addends = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        const destination = this.Tape[this._instructionPointer + 3];
        // this.Tape[destination] = addends[0] + addends[1];
        this.WriteDestination(destination, addends[0]+addends[1])

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
        // this.Tape[destination] = multiplicands[0] * multiplicands[1];
        this.WriteDestination(destination, multiplicands[0] * multiplicands[1]);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private BRK(): IntcodeMachine {
        // if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " BRK "); }
        this.WriteVerbose("BRK");
        if (this._options.VerboseMode) { console.log(); }

        // We don't need to increment the instruction pointer because when we break on BRK, we want future executions to BRK as well
        return null;
    }

    private INP(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.INP);
        // if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " INP "); }
        this.WriteVerbose("INP");

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
        // if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " JIT "); }
        this.WriteVerbose("JIT");
        const conditional = this.GetParameters(1);
        const jumpAddress = this.GetParameters(2);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional != 0 ? jumpAddress : this._instructionPointer + 3;
        return this;
    }

    private JIF(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.JIF);
        // if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " JIF "); }
        this.WriteVerbose("JIF");
        const conditional = this.GetParameters(1);
        const jumpAddress = this.GetParameters(2);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional == 0 ? jumpAddress : this._instructionPointer + 3;
        return this;
    }

    private LNE(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.LNE);
        // if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " LNE "); }
        this.WriteVerbose("LNE");

        const comparators = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        
        const destination = this.Tape[this._instructionPointer + 3];
        // this.Tape[destination] = comparators[0] < comparators[1] ? 1 : 0;
        this.WriteDestination(destination, comparators[0] < comparators[1] ? 1 : 0);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private EQU(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.EQU);
        // if (this._options.VerboseMode) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " EQU "); }
        this.WriteVerbose("EQU");

        const comparators = [1, 2].map((val: number): number => this.GetParameters(val));
        if (this._options.VerboseMode) { process.stdout.write(" &" + this._instructionPointer + 3); }
        
        const destination = this.Tape[this._instructionPointer + 3];
        // this.Tape[destination] = comparators[0] == comparators[1] ? 1 : 0;
        this.WriteDestination(destination, comparators[0] == comparators[1] ? 1 : 0);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    // ARB == Adjust Relative Base
    private ARB(): IntcodeMachine {
        // this._relativeBase += this.Tape[this._instructionPointer + 1];
        // const offset = this.Tape[this._instructionPointer + 1];
        const offset = this.GetParameters(1);
        this.WriteVerbose("ARB #" + offset.toString());

        this._relativeBase += offset;
        
        if (this._options.VerboseMode) { console.log(); }        
        this._instructionPointer += 2;
        return this;
    }

    public ExecuteTape(): IntcodeMachine {
        let shouldBreak = false;
        while (!shouldBreak) { shouldBreak = this.OPC() === null; }
        return this;
    }
}