"use strict";

export type IntcodeMachineOptions = {
    InputValues: bigint[];
    VerboseMode: boolean;
    SilentMode: boolean;
    BreakOnOutput: boolean;
    BreakBeforeInput: boolean;
}

export type Point = {
    x: number;
    y: number;
}