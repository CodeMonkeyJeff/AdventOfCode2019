"use strict";

export type IntcodeMachineOptions = {
    InputValues: bigint[];
    VerboseMode: boolean;
    SilentMode: boolean;
    BreakOnOutput: boolean;
    BreakBeforeInput: boolean;
}

export type TwoDPoint = {
    x: number;
    y: number;
}


// Day 12
export type ThreeDPoint = {
    [P in keyof TwoDPoint]: TwoDPoint[P];
} & {
    z: number;
}

export type Moon = {
    position: ThreeDPoint;
    velocity: ThreeDPoint;
}