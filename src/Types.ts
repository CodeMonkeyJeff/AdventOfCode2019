"use strict";

export type IntcodeMachineOptions = {
    InputValues: bigint[];
    VerboseMode: boolean;
    SilentMode: boolean;
    BreakOnOutput: boolean;
}