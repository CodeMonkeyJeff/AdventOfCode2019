"use strict";

export enum Opcode {
    ADD = 1,
    MUL = 2,
    INP = 3,
    OUT = 4,
    BRK = 99
}

export enum WireDirection {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R"
}

export enum ParameterMode {
    Position = 0,
    Immediate = 1
}