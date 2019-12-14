"use strict";

import { TyrannyOfRocketEquation } from "./TyrannyOfRocketEquation";
import { ProgramAlarm1202 } from "./ProgramAlarm1202";
import { CrossedWires } from "./CrossedWires";
import { performance } from "perf_hooks";
import { SecureContainer } from "./SecureContainer";
import { ThermalEnvironmentSupervisionTerminal } from "./ThermalEnvironmentSupervisionTerminal";
import { UniversalOrbitMap } from "./UniversalOrbitMap";
import { AmplificationCircuit } from "./AmplificationCircuit";
import { SpaceImageFormat } from "./SpaceImageFormat";
import { SensorBoost } from "./SensorBoost";

const tF = (callbackFn: () => string): string => {
    const t0 = performance.now();
    const result = callbackFn();
    const t1 = performance.now();
    return result.padStart(25) + (t1 - t0).toFixed(3).toString().padStart(25) + " milliseconds";
}
console.log();

console.log("Advent of Code 2019");
console.log("-------------------");
console.log("Day  1 Part 1" + tF(TyrannyOfRocketEquation.Day1Part1));
console.log("Day  1 Part 2" + tF(TyrannyOfRocketEquation.Day1Part2));
console.log("Day  2 Part 1" + tF(ProgramAlarm1202.Day2Part1));
console.log("Day  2 Part 2" + tF(ProgramAlarm1202.Day2Part2));
console.log("Day  3 Part 1" + tF(CrossedWires.Day3Part1));
console.log("Day  3 Part 2" + tF(CrossedWires.Day3Part2));
console.log("Day  4 Part 1" + tF(SecureContainer.Day4Part1));
console.log("Day  4 Part 2" + tF(SecureContainer.Day4Part2));
console.log("Day  5 Part 1" + tF(ThermalEnvironmentSupervisionTerminal.Day5Part1));
console.log("Day  5 Part 2" + tF(ThermalEnvironmentSupervisionTerminal.Day5Part2));
console.log("Day  6 Part 1" + tF(UniversalOrbitMap.Day6Part1));
console.log("Day  6 Part 2" + tF(UniversalOrbitMap.Day6Part2));
console.log("Day  7 Part 1" + tF(AmplificationCircuit.Day7Part1));
console.log("Day  7 Part 2" + tF(AmplificationCircuit.Day7Part2));
console.log("Day  8 Part 1" + tF(SpaceImageFormat.Day8Part1));
console.log("Day  8 Part 2" + tF(SpaceImageFormat.Day8Part2));
console.log("Day  9 Part 1" + tF(SensorBoost.Day9Part1));
console.log("Day  9 Part 2" + tF(SensorBoost.Day9Part2));

console.log();