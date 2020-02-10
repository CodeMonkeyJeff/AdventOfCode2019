"use strict";

type Pattern = {
    positives: Array<number>;
    negatives: Array<number>;
}

export class FlawedFrequencyTransmission {
    private signal: number[];

    public constructor(signal: number[]) {
        this.signal = signal;
    }

    public static GetPattern(index: number, length: number): Pattern {
        const getArray = (reps: number): number[] => {
            const patternLength = 4 * (index + 1);
            const groupings: number[][] = new Array<number>(length / 4).fill(reps)
                .map((v: number, i: number): number => v + i * patternLength)
                .map((v: number): number[] => new Array<number>(index + 1).fill(v).map((v: number, i: number): number => v + i));
            return [].concat(...groupings).filter(e => e < length);
        }

        return { positives: getArray(index), negatives: getArray(3 * index + 2) };
    }

    public static GetAllPatterns(length: number): Pattern[] {
        const patterns = new Array<Pattern>();
        for (let i = 0; i < length; i++) { 
            patterns.push(FlawedFrequencyTransmission.GetPattern(i, length)); 
        }
        return patterns;
    }

    public NextAttempt(offset = 0): number[] {
        // For index M...
        //  Positives..   M   + 4k(M+1) ... 2M   + 4k(M+1)   k=0,1,...
        //  Negatives..  3M+2 + 4k(M+1) ... 4M+2 + 4k(M+1)   k=0,1,...

        const s = new Array<number>(this.signal.length)
        //* Computing s[i]
        s[this.signal.length - 1] = this.signal[this.signal.length - 1];
        for (let i = this.signal.length - 1; i > offset; i--) {
            s[i - 1] = this.signal[i - 1] + s[i];
            s[i - 1] = s[i - 1] % 10;


            // const reps = Math.ceil(this.signal.length / (i+1)); // Minimum 1
            // for (let k=0; k < reps; k++) {
            //     //* Adding in the arithmetic progressions for M..2M
            //     const order = 4 * k * (i + 1);

            //     // Positives
            //     for (let m = Math.min(this.signal.length - 1, 2 * i); m >= i; m--) {
            //         s[i] += this.signal[i + order];
            //     }

            //     // Negatives
            //     for (let m = Math.min(this.signal.length - 1, 4 * i + 2); m >= 3*i+2; m--) {
            //         s[i] -= this.signal[i + order];
            //     }
            // }
            // s[i] = Math.abs(s[i]) % 10;
        }

        return s;
    }
    
    public ExecutePhase(): number[] {
        // const sum = (indexes: number[]): number => indexes.reduce((total: number, current: number): number => total + signal[current], 0);

        const result = new Array<number>(this.signal.length).fill(0);
        for (let i=0; i < this.signal.length; i++) {
            for (let j=0; j <= i; j++) {
                for (let k=0; k <= this.signal.length / 4*(i+1); k++) {
                    const order = 4 * k * (i + 1);
                    const n = 3*i + 2;

                    if (i + j + order < this.signal.length) { result[i + j] += this.signal[i + j + order]; }
                    if (n + j + order < this.signal.length) { result[i + j] -= this.signal[n + j + order]; }
                }
            }
            // Positives from i...2i            plus an offset 4k(i+1)
            // Negatives from 3i+2 ... 4i+2     plus an offset 4k(i+1)

            result[i] = Math.abs(result[i]) % 10;
        }
        // for (let i=0; i < signal.length; i++) {
        //     const pattern = patterns[i];
        //     result[i] = Math.abs(sum(pattern.positives) - sum(pattern.negatives)) % 10;
        // }

        return result;
    }

    // // Returns the first *numDigits* of the final output list of the phases
    // public static ExecuteMultiplePhases(input: number[], numPhases: number): number[] {
    //     let signal = input;
    //     const patterns = FlawedFrequencyTransmission.GetAllPatterns(input.length);

    //     //! Need to cut down on the execution space -- can we determine a priori what
    //     //!     actual values are needed to calculate the desired digits?
    //     for (let i = 0; i < numPhases; i++) { signal = FlawedFrequencyTransmission.ExecutePhase(signal, patterns); }
    //     return signal;
    // }

    public static ConvertInputSignal(signal: string): number[] {
        const result = new Array<number>(signal.length).fill(0);

        for (let i=0; i < signal.length; i++) {
            result[i] = parseInt(signal[i]);
        }

        return result;
    }

    public static RepeatSignal(signal: number[], numRepetitions: number): number[] {
        return [].concat(...new Array<number[]>(numRepetitions).fill(signal));
    }

    public static Day16Part1(): string {
        const input = "59728839950345262750652573835965979939888018102191625099946787791682326347549309844135638586166731548034760365897189592233753445638181247676324660686068855684292956604998590827637221627543512414238407861211421936232231340691500214827820904991045564597324533808990098343557895760522104140762068572528148690396033860391137697751034053950225418906057288850192115676834742394553585487838826710005579833289943702498162546384263561449255093278108677331969126402467573596116021040898708023407842928838817237736084235431065576909382323833184591099600309974914741618495832080930442596854495321267401706790270027803358798899922938307821234896434934824289476011";
        const signal = FlawedFrequencyTransmission.ConvertInputSignal(input);
        const fft = new FlawedFrequencyTransmission(signal);
        for (let i=0; i < 100; i++) {
            fft.signal = fft.ExecutePhase();
        }
        // const result = FlawedFrequencyTransmission.ExecuteMultiplePhases(signal, 100).slice(0,8);
        return fft.signal.map(v => v.toString()).join("").toString();
    }

    public static Day16Part2(): string {
        const input = "59728839950345262750652573835965979939888018102191625099946787791682326347549309844135638586166731548034760365897189592233753445638181247676324660686068855684292956604998590827637221627543512414238407861211421936232231340691500214827820904991045564597324533808990098343557895760522104140762068572528148690396033860391137697751034053950225418906057288850192115676834742394553585487838826710005579833289943702498162546384263561449255093278108677331969126402467573596116021040898708023407842928838817237736084235431065576909382323833184591099600309974914741618495832080930442596854495321267401706790270027803358798899922938307821234896434934824289476011";
        const offset = parseInt(input.slice(0,7));
        const signal = FlawedFrequencyTransmission.RepeatSignal(FlawedFrequencyTransmission.ConvertInputSignal(input), 10000);
        const fft = new FlawedFrequencyTransmission(signal);
        
        for (let i=0; i < 100; i++) {
            fft.signal = fft.NextAttempt(offset);
        }

        const s = fft.signal.slice(offset, offset+8);
        return s.map(v => v.toString()).join("");
    }
}