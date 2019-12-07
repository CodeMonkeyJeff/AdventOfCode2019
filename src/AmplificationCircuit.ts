"use strict";

import { IntcodeMachine } from "./IntCodeMachine";

export class AmplificationCircuit {
    private readonly _ampCode: number[];
    
    public constructor(ampCode: number[]) { this._ampCode = ampCode; }

    private RunAmplifier(phaseSetting: number, inputSignal: number): number {        
        const machine = new IntcodeMachine(this._ampCode, { InputValues: [phaseSetting, inputSignal], SilentMode: true });
        machine.ExecuteTape();
        return machine.OutputValues[0];
    }

    // Runs amplifiers five times with inputs in phaseSettingSequence
    public CalculateThrust(phaseSettingSequence: number[], inputSignal = 0): number {
        if (phaseSettingSequence.length == 0) { throw new Error("Tried to run an amplifier without a phase setting!"); }
        const phaseSetting = phaseSettingSequence.shift();
        const signal = this.RunAmplifier(phaseSetting, inputSignal);
        if (phaseSettingSequence.length > 0) {
            const thrust = this.CalculateThrust(phaseSettingSequence, signal); 
            phaseSettingSequence.unshift(phaseSetting); // Returning an unchanged phase setting sequence
            return thrust;
        }
        phaseSettingSequence.unshift(phaseSetting);     // Returning an unchanged phase setting sequence
        return signal;
    }

    public GetMaxPhaseSettingSequence(): number[] {
        const bestPhaseSettings = { phaseSettingSequence: [], thrust: 0};
        const permutations = AmplificationCircuit.GeneratePermutations([0, 1, 2, 3, 4]);
        permutations.forEach((phaseSettingSequence: number[]): void => {
            const thrust = this.CalculateThrust(phaseSettingSequence);
            if (thrust > bestPhaseSettings.thrust) {
                bestPhaseSettings.phaseSettingSequence = phaseSettingSequence;
                bestPhaseSettings.thrust = thrust;
            }
        });

        return bestPhaseSettings.phaseSettingSequence;
    }


    private static GeneratePermutations(inputArray: number[]): Array<number[]> {
        const result: Array<number[]> = [];

        const permute = (arr: number[], m: number[] = []): void => {
            if (arr.length ===0) {
                result.push(m);
            } else {
                for (let i = 0; i < arr.length; i++) {
                    const curr = arr.slice();
                    const next = curr.splice(i, 1);
                    permute(curr.slice(), m.concat(next));
                }
            }
        }

        permute(inputArray);
        return result;
    }

    public static Day7Part1(): string {
        const _amplifierCode = [3, 8, 1001, 8, 10, 8, 105, 1, 0, 0, 21, 38, 55, 64, 81, 106, 187, 268, 349, 430, 99999, 3, 9, 101, 2, 9, 9, 1002, 9, 2, 9, 101, 5, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 101, 3, 9, 9, 1002, 9, 4, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 5, 9, 1001, 9, 4, 9, 102, 4, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 1001, 9, 5, 9, 102, 3, 9, 9, 1001, 9, 4, 9, 102, 5, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 99, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 99, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1001, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 101, 2, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1001, 9, 1, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 1002, 9, 2, 9, 4, 9, 3, 9, 101, 1, 9, 9, 4, 9, 3, 9, 102, 2, 9, 9, 4, 9, 99];
        
        const circuit = new AmplificationCircuit(_amplifierCode);
        const maxPhaseSettingSequence = circuit.GetMaxPhaseSettingSequence();
        const thrust = circuit.CalculateThrust(maxPhaseSettingSequence);
        return thrust.toString();
    }
}