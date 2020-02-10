"use strict";

type Pattern = {
    positives: Array<number>;
    negatives: Array<number>;
}

export class FlawedFrequencyTransmission {
    private signal: number[];

    public constructor(signal: number[]) { this.signal = signal; }

    public NaiveSummation(offset = 0): number[] {
        const s = new Array<number>(this.signal.length)
        s[this.signal.length - 1] = this.signal[this.signal.length - 1];
        for (let i = this.signal.length - 1; i > offset; i--) {
            s[i - 1] = this.signal[i - 1] + s[i];
            s[i - 1] = s[i - 1] % 10;
        }

        return s;
    }
    
    public ExecutePhase(): number[] {
        const sum = (interval: number[]): number => this.signal.slice(interval[0], interval[1] + 1).reduce((total: number, current: number): number => total + current, 0);
        const normalize = (interval: number[], offset: number): number[] => interval.map(v => Math.min(v + offset, this.signal.length));

        const result = new Array<number>(this.signal.length).fill(0);
        for (let i=0; i < this.signal.length; i++) {
            const positiveInterval = [i, 2 * i];                // Positives are from i ... 2i
            const negativeInterval = [3 * i + 2, 4 * i + 2];    // Negatives are from 3i+2 ... 4i+2
            const patternLength = 4*(i+1);      // Offset is 4 times the pattern length
            for (let k=0; k*patternLength < this.signal.length; k++) {
                result[i] += sum(normalize(positiveInterval, k * patternLength));
                result[i] -= sum(normalize(negativeInterval, k * patternLength));
            }
        }


        return result.map(v => Math.abs(v) % 10);
    }

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
        for (let i = 0; i < 100; i++) { fft.signal = fft.ExecutePhase(); }
        return fft.signal.slice(0, 8).map(v => v.toString()).join("").toString();
    }

    public static Day16Part2(): string {
        const input = "59728839950345262750652573835965979939888018102191625099946787791682326347549309844135638586166731548034760365897189592233753445638181247676324660686068855684292956604998590827637221627543512414238407861211421936232231340691500214827820904991045564597324533808990098343557895760522104140762068572528148690396033860391137697751034053950225418906057288850192115676834742394553585487838826710005579833289943702498162546384263561449255093278108677331969126402467573596116021040898708023407842928838817237736084235431065576909382323833184591099600309974914741618495832080930442596854495321267401706790270027803358798899922938307821234896434934824289476011";
        const offset = parseInt(input.slice(0,7));
        const signal = FlawedFrequencyTransmission.RepeatSignal(FlawedFrequencyTransmission.ConvertInputSignal(input), 10000);
        const fft = new FlawedFrequencyTransmission(signal);
        
        for (let i = 0; i < 100; i++) { fft.signal = fft.NaiveSummation(offset); }
        return fft.signal.slice(offset, offset+8).map(v => v.toString()).join("");
    }
}