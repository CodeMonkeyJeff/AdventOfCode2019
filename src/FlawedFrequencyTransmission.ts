"use strict";

import readline = require("readline-sync");

export class FlawedFrequencyTransmission {
    private readonly _currentSignal: number[];
    private readonly _patterns: number[][];

    public get Signal(): number[] { return this._currentSignal; }

    public constructor(signal: string) {
        this._currentSignal = FlawedFrequencyTransmission.ConvertInputSignal(signal);
        this._patterns = FlawedFrequencyTransmission.GeneratePatterns(this._currentSignal.length);
    }

    public static GeneratePatterns(length: number): number[][] {
        const repeatNumber = (input: number, numRepetitions: number): number[] => (new Array<number>(numRepetitions)).fill(input);
        const flattenArray = (input: number[][]): number[] => [].concat(...input);

        const basePattern = [0, 1, 0, -1];
        const result = new Array<number[]>(length);
        for (let i=0; i < length; i++) {
            const pattern = new Array<number>(length);
            const patternWithRepeats = flattenArray(basePattern.map((v: number): number[] => repeatNumber(v, i + 1)));
            // patternWithRepeats.shift();

            for (let j = 0; j < length; j++) { pattern[j] = patternWithRepeats[(1 + j) % patternWithRepeats.length]; }
            result[i] = pattern
        }

        return result;
    }

    public ExecutePhase(): number[] {
        const result = (new Array<number>(this._currentSignal.length)).fill(0);

        for (let i=0; i < this._currentSignal.length; i++) {
            const pattern = this._patterns[i];
            const product = FlawedFrequencyTransmission.DotProduct(this._currentSignal, pattern);
            result[i] = Math.abs(product) % 10;
        }

        result.forEach((v: number, i: number): void => { this._currentSignal[i] = v; });
        return this._currentSignal;
    }

    // Returns the first *numDigits* of the final output list of the phases
    public ExecuteMultiplePhases(numPhases: number, numDigits: number): number[] {
        for (let i = 0; i < numPhases; i++) {
            this.ExecutePhase();
        }
        return this._currentSignal.slice(0, numDigits);
    }

    public static ConvertInputSignal(signal: string): number[] {
        const result = new Array<number>(signal.length).fill(0);

        for (let i=0; i < signal.length; i++) {
            result[i] = parseInt(signal[i]);
        }

        return result;
    }

    private static DotProduct(a: number[], b: number[]): number {
        return a.reduce((total: number, current: number, index: number): number => {
            total += current * b[index];
            return total;
        }, 0);
    }

    private PrintDotProduct(iter: number, pattern: number[], product: number): void {
        const message = this._currentSignal.map((v: number, index: number): string => (pattern[index].toString() + "*" + v.toString()).padEnd(5));
            console.log((iter.toString() + ":  ").padStart(5,' ') + message.join(" + ") + " = " + product.toString());                
    }

    public static Day16Part1(): string {
        const input = "59728839950345262750652573835965979939888018102191625099946787791682326347549309844135638586166731548034760365897189592233753445638181247676324660686068855684292956604998590827637221627543512414238407861211421936232231340691500214827820904991045564597324533808990098343557895760522104140762068572528148690396033860391137697751034053950225418906057288850192115676834742394553585487838826710005579833289943702498162546384263561449255093278108677331969126402467573596116021040898708023407842928838817237736084235431065576909382323833184591099600309974914741618495832080930442596854495321267401706790270027803358798899922938307821234896434934824289476011";
        const fft = new FlawedFrequencyTransmission(input);
        const result = fft.ExecuteMultiplePhases(100, 8);
        return result.join("").toString();
        // const tests = [
        //     { signal: "12345678", numPhases: 4, numDigits: 8, result: [0, 1, 0, 2, 9, 4, 9, 8] },
        //     { signal: "80871224585914546619083218645595", numPhases: 100, numDigits: 8, result: [2, 4, 1, 7, 6, 1, 7, 6] },
        //     { signal: "19617804207202209144916044189917", numPhases: 100, numDigits: 8, result: [7, 3, 7, 4, 5, 4, 1, 8] },
        //     { signal: "69317163492948606335995924319873", numPhases: 100, numDigits: 8, result: [5, 2, 4, 3, 2, 1, 3, 3] }
        // ];

        // const test = tests[1];
        // const fft = new FlawedFrequencyTransmission(test.signal);
        // const result = fft.ExecuteMultiplePhases(test.numPhases, test.numDigits)
        // return result.join("").toString();
    }
}