"use strict";

export enum Opcode {
    ADD = 1,
    MUL = 2,
    INP = 3,
    OUT = 4,
    JIT = 5,    // Jump-if-true
    JIF = 6,    // Jump-if-false
    LNE = 7,    // Strictly less than
    EQU = 8,
    ARB = 9,    // Adjust Relative Base
    BRK = 99
}

export enum Direction {
    Up = "U",
    Down = "D",
    Left = "L",
    Right = "R"
}

export enum ParameterMode {
    Position = 0,
    Immediate = 1,
    Relative = 2
}

export enum HullColor {
    Black = 0,
    White = 1
}
