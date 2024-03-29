"use strict";
import { performance } from "perf_hooks";

import { TyrannyOfRocketEquation } from "./Days/TyrannyOfRocketEquation";
import { ProgramAlarm1202 } from "./Days/ProgramAlarm1202";
import { CrossedWires } from "./Days/CrossedWires";
import { SecureContainer } from "./Days/SecureContainer";
import { ThermalEnvironmentSupervisionTerminal } from "./Days/ThermalEnvironmentSupervisionTerminal";
import { UniversalOrbitMap } from "./Days/UniversalOrbitMap";
import { AmplificationCircuit } from "./Days/AmplificationCircuit";
import { SpaceImageFormat } from "./Days/SpaceImageFormat";
import { SensorBoost } from "./Days/SensorBoost";
import { MonitoringStation } from "./Days/MonitoringStation";
import { HullPaintingRobot } from "./Days/HullPaintingRobot";
import { NBody } from "./Days/NBody";
import { ArcadeCabinet } from "./Days/ArcadeCabinet";
import { SpaceStoichiometry } from "./Days/SpaceStoichiometry";
import { OxygenSystem } from "./Days/OxygenSystem";
import { FlawedFrequencyTransmission } from "./Days/FlawedFrequencyTransmission";
import { SetAndForget } from "./Days/SetAndForget";

const benchmarks = new Array<number>();
const totalTime = (): string => "Total Time:  " + benchmarks.reduce((t,c) => t+c).toFixed(3).padStart(50) + " milliseconds";

const tF = (callbackFn: () => string): string => {
    const t0 = performance.now();
    const result = callbackFn();
    const t1 = performance.now();
    benchmarks.push(t1 - t0);
    return result.padStart(25) + (t1 - t0).toFixed(3).padStart(25) + " milliseconds";
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
console.log("Day 10 Part 1" + tF(MonitoringStation.Day10Part1));
console.log("Day 10 Part 2" + tF(MonitoringStation.Day10Part2));
console.log("Day 11 Part 1" + tF(HullPaintingRobot.Day11Part1));
console.log("Day 11 Part 2" + tF(HullPaintingRobot.Day11Part2));
console.log("Day 12 Part 1" + tF(NBody.Day12Part1));
console.log("Day 12 Part 1" + tF(NBody.Day12Part2));
console.log("Day 13 Part 1" + tF(ArcadeCabinet.Day13Part1));
console.log("Day 13 Part 2" + tF(ArcadeCabinet.Day13Part2));
console.log("Day 14 Part 1" + tF(SpaceStoichiometry.Day14Part1));
console.log("Day 14 Part 2" + tF(SpaceStoichiometry.Day14Part2));
console.log("Day 15 Part 1" + tF(OxygenSystem.Day15Part1));
console.log("Day 15 Part 2" + tF(OxygenSystem.Day15Part2));
console.log("Day 16 Part 1" + tF(FlawedFrequencyTransmission.Day16Part1));
console.log("Day 16 Part 2" + tF(FlawedFrequencyTransmission.Day16Part2));
console.log("Day 17 Part 1" + tF(SetAndForget.Day17Part1));
console.log("Day 17 Part 2" + tF(SetAndForget.Day17Part2));

console.log(totalTime());
console.log();