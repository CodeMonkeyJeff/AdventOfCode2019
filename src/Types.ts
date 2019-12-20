"use strict";

export type IntcodeMachineOptions = {
    InputValues: bigint[];
    VerboseMode: boolean;
    SilentMode: boolean;
    BreakOnOutput: boolean;
}

export type Point = {
    x: number;
    y: number;
}