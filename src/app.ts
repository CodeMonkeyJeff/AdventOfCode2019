"use strict";

import { TyrannyOfRocketEquation } from "./TyrannyOfRocketEquation";
import { ProgramAlarm1202 } from "./ProgramAlarm1202";
import { CrossedWires } from "./CrossedWires";

console.log();

console.log("Advent of Code 2019");
console.log("-------------------");
console.log("Day  1 Part 1" + TyrannyOfRocketEquation.Day1Part1().padStart(25));
console.log("Day  1 Part 2" + TyrannyOfRocketEquation.Day1Part2().padStart(25));
console.log("Day  2 Part 1" + ProgramAlarm1202.Day2Part1().padStart(25));
console.log("Day  2 Part 2" + ProgramAlarm1202.Day2Part2().padStart(25));

// Temp stuff
console.log();
const wirepath1 = [ "R8, U5", "L5", "D3" ];
const wirepath2 = [ "U7, R6", "D4", "L4" ];
const o = new CrossedWires(wirepath1, wirepath2);

o.PrintWireGrid();
console.log();
// End Temp stuff

console.log();