"use strict";

import { Opcode, ParameterMode } from "./Enum";
import { IntcodeMachineOptions } from "./Types";

export class IntcodeMachine {
    public Tape: bigint[];
    public InputValues: bigint[];
    public readonly OutputValues: bigint[];
    public readonly BreakOnOutput: boolean;
    public readonly BreakBeforeInput: boolean;

    private _instructionPointer: number;
    private readonly _initialTape: bigint[];
    private readonly _options: IntcodeMachineOptions;
    private _relativeBase: number;

    public constructor(initialTape: bigint[], options: Partial<IntcodeMachineOptions> = {}) {
        this._initialTape = initialTape;
        this.Tape = Array.from(initialTape);
        this._instructionPointer = 0;
        this._relativeBase = 0;
        this._options = Object.assign({
            InputValues: new Array<bigint>(),
            VerboseMode: false,
            SilentMode: false,
            BreakOnOutput: false,
            BreakBeforeInput: false,
        }, options);

        this.InputValues = this._options.InputValues;
        this.OutputValues = new Array<bigint>();
        this.BreakOnOutput = this._options.BreakOnOutput;
        this.BreakBeforeInput = this._options.BreakBeforeInput;
    }

    public get CurrentInstruction(): number { return Number(this.Tape[this._instructionPointer] % 100n); }

    public OPC(): IntcodeMachine {
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

    private WriteVerbose(message: string, outputProgramCounter = true): void { 
        if (this._options.VerboseMode) {
            if (outputProgramCounter) { process.stdout.write(this._instructionPointer.toString().padStart(2) + " "); }
            process.stdout.write(message + " "); 
        } 
    }

    private WriteDestination(destination: number, value: bigint): IntcodeMachine {
        this.ExtendTape(destination);
        this.Tape[destination] = value;
        return this;
    }

    private CheckOpcodeCall(expectedOpcode: Opcode): void { if (this.CurrentInstruction != expectedOpcode) { throw new Error("Illegal call to " + expectedOpcode); } }

    private GetParameters(position: number, isDestination = false): bigint {
        const mode = Math.floor(Number(this.Tape[this._instructionPointer]) / Math.pow(10, position+1)) % 10;
        const addr = this._instructionPointer + position;
        this.ExtendTape(addr);

        switch (mode) {            
            case ParameterMode.Position:
                this.WriteVerbose(("&" + Number(this.Tape[addr]).toString()).padStart(5, ' '), false);
                this.ExtendTape(Number(this.Tape[addr]));
                return isDestination ? this.Tape[addr] : this.Tape[Number(this.Tape[addr])];
                break;
            case ParameterMode.Immediate:
                this.WriteVerbose(("#" + this.Tape[addr].toString()).padStart(5, ' '), false);
                this.ExtendTape(Number(addr));
                return this.Tape[addr];
                break;
            case ParameterMode.Relative:
                this.WriteVerbose((this.Tape[addr].toString() + ", " + this._relativeBase.toString()).padStart(5, ' '), false);
                this.ExtendTape(Number(this.Tape[addr]) + this._relativeBase);
                return isDestination ? this.Tape[addr] + BigInt(this._relativeBase) : this.Tape[Number(this.Tape[addr]) + this._relativeBase];
                break;
            default:
                throw new Error("Parameter Mode is Illegal or Not Implemented");
                break;
        }
    }

    private ExtendTape (destination: number): void {
        if (this.Tape.length < destination + 1) {            
            const extArray: bigint[] = new Array(destination - this.Tape.length + 1).fill(0n);
            this.Tape.push(...extArray);
        }
    }

    private ADD(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.ADD);
        this.WriteVerbose("ADD");

        const addends = [1, 2].map((val: number): bigint => this.GetParameters(val));
        const destination = Number(this.GetParameters(3, true));
        this.WriteDestination(destination, addends[0] + addends[1]);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private MUL(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.MUL);
        this.WriteVerbose("MUL");

        const multiplicands = [1, 2].map((val: number): bigint => this.GetParameters(val));
        const destination = Number(this.GetParameters(3, true));
        this.WriteDestination(destination, multiplicands[0] * multiplicands[1]);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private BRK(): IntcodeMachine {
        this.WriteVerbose("BRK");
        if (this._options.VerboseMode) { console.log(); }

        // We don't need to increment the instruction pointer because when we break on BRK, we want future executions to BRK as well
        return null;
    }

    private INP(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.INP);        

        // Spec says to take this from the command line, but ain't nobody got time for that.
        if (this.InputValues.length == 0) { 
            if (this.BreakBeforeInput) { return null; }
            throw new Error("Did not specify an input value!"); 
        }

        this.WriteVerbose("INP");

        const input = this.InputValues.shift();        
        const destination = Number(this.GetParameters(1, true));
        this.Tape[destination] = input;

        if (this._options.VerboseMode) { process.stdout.write((" <== #" + input.toString()).padStart(20, ' ')); }
        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 2;
        return this;
    }

    private OUT(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.OUT);
        this.WriteVerbose("OUT");
        const value = this.GetParameters(1);

        this.OutputValues.push(value);       // For easy retrieval later
        if (!this._options.SilentMode) { console.log((" ==> #" + value.toString()).padStart(20, ' ')); }
        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 2;

        if (this.BreakOnOutput) { return null; } else { return this; }
    }

    private JIT(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.JIT);
        this.WriteVerbose("JIT");

        const conditional = Number(this.GetParameters(1));
        const jumpAddress = Number(this.GetParameters(2));

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional != 0 ? jumpAddress : this._instructionPointer + 3;
        return this;
    }

    private JIF(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.JIF);
        this.WriteVerbose("JIF");

        const conditional = Number(this.GetParameters(1));
        const jumpAddress = Number(this.GetParameters(2));

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer = conditional == 0 ? jumpAddress : this._instructionPointer + 3;
        return this;
    }

    private LNE(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.LNE);
        this.WriteVerbose("LNE");

        const comparators = [1, 2].map((val: number): bigint => this.GetParameters(val));
        const destination = Number(this.GetParameters(3, true));
        this.WriteDestination(destination, comparators[0] < comparators[1] ? 1n : 0n);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    private EQU(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.EQU);
        this.WriteVerbose("EQU");

        const comparators = [1, 2].map((val: number): bigint => this.GetParameters(val));
        const destination = Number(this.GetParameters(3, true));
        this.WriteDestination(destination, comparators[0] == comparators[1] ? 1n : 0n);

        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 4;
        return this;
    }

    // ARB == Adjust Relative Base
    private ARB(): IntcodeMachine {
        this.CheckOpcodeCall(Opcode.ARB);
        this.WriteVerbose("ARB");

        this._relativeBase += Number(this.GetParameters(1));        
        if (this._options.VerboseMode) { console.log(); }
        this._instructionPointer += 2;
        return this;
    }

    public ExecuteTape(): IntcodeMachine {
        let shouldBreak = false;
        while (!shouldBreak) {
            const result = this.OPC();
            shouldBreak = result === null; 
        }
        return this;
    }
}