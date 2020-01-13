"use test";

import { SpaceStoichiometry } from "../src/SpaceStoichiometry";
import assert = require("assert");

const data: string[][] = new Array<string[]>();
data.push(["10 ORE => 10 A", "1 ORE => 1 B", "7 A, 1 B => 1 C", "7 A, 1 C => 1 D", "7 A, 1 D => 1 E", "7 A, 1 E => 1 FUEL"]);
data.push(["9 ORE => 2 A", "8 ORE => 3 B", "7 ORE => 5 C", "3 A, 4 B => 1 AB", "5 B, 7 C => 1 BC", "4 C, 1 A => 1 CA", "2 AB, 3 BC, 4 CA => 1 FUEL"]);
data.push(["157 ORE => 5 NZVS", "165 ORE => 6 DCFZ", "44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL", "12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ", "179 ORE => 7 PSHF", "177 ORE => 5 HKGWZ", "7 DCFZ, 7 PSHF => 2 XJWVT", "165 ORE => 2 GPVTF", "3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT"]);
data.push(["2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG", "17 NVRVD, 3 JNWZP => 8 VPVL", "53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL", "22 VJHF, 37 MNCFX => 5 FWMGM", "139 ORE => 4 NVRVD", "144 ORE => 7 JNWZP", "5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC", "5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV", "145 ORE => 6 MNCFX", "1 NVRVD => 8 CXFTF", "1 VJHF, 6 MNCFX => 4 RFSQX", "176 ORE => 6 VJHF"]);
data.push(["171 ORE => 8 CNZTR","7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL","114 ORE => 4 BHXH","14 VRPVC => 6 BMBT","6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL","6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT","15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW","13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW","5 BMBT => 4 WPTQ","189 ORE => 9 KTJDG","1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP","12 VRPVC, 27 CNZTR => 2 XDBXC","15 KTJDG, 12 BHXH => 5 XCVML","3 BHXH, 2 VRPVC => 7 MZWV","121 ORE => 7 VRPVC","7 XCVML => 6 RJRHP","5 BHXH, 4 VRPVC => 5 LTCX"]);


describe("Day 14 -- SpaceStoichiometry", function() {
    describe("CreateReactant", function() {
        const tests = [
            { name: "ORE", quantity: 171, result: { name: "ORE", quantity: 171 } },
            { name: "CNZTR", quantity: 8, result: { name: "CNZTR", quantity: 8 } },
            { name: "ZLQW", quantity: 7, result: { name: "ZLQW", quantity: 7 } },
            { name: "BMBT", quantity: 3, result: { name: "BMBT", quantity: 3} }
        ];

        tests.forEach((test): void => {
            it(test.name, function() {
                const result = SpaceStoichiometry.CreateReactant(test.name, test.quantity);
                assert.deepEqual(result, test.result);
            });
        });
    });

    describe("ParseReactant", function() {
        const tests = [
            { data: "171 ORE", result: SpaceStoichiometry.CreateReactant("ORE", 171) },
            { data: "8 CNZTR", result: SpaceStoichiometry.CreateReactant("CNZTR", 8)},
            { data: "7 ZLQW", result: SpaceStoichiometry.CreateReactant("ZLQW", 7) },
            { data: "3 BMBT", result: SpaceStoichiometry.CreateReactant("BMBT", 3) },
            { data: "9 XCVML", result: SpaceStoichiometry.CreateReactant("XCVML", 9) },
            { data: "26 XMNCP", result: SpaceStoichiometry.CreateReactant("XMNCP", 26) }
        ];

        tests.forEach((test): void => {
            it(test.data, function() {
                const result = SpaceStoichiometry.ParseReactant(test.data);
                assert.deepEqual(result, test.result);
            });
        });
    });

    describe("ParseInput", function() {
        const tests = [
            { data: "171 ORE", result: [SpaceStoichiometry.CreateReactant("ORE", 171)]},
            { data: "7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP", result: [
                SpaceStoichiometry.CreateReactant("ZLQW", 7),
                SpaceStoichiometry.CreateReactant("BMBT", 3),
                SpaceStoichiometry.CreateReactant("XCVML", 9),
                SpaceStoichiometry.CreateReactant("XMNCP", 26),
                SpaceStoichiometry.CreateReactant("WPTQ", 1),
                SpaceStoichiometry.CreateReactant("MZWV", 2),
                SpaceStoichiometry.CreateReactant("RJRHP", 1)
            ] },
            { data: "4 BHXH, 14 VRPVC", result: [
                SpaceStoichiometry.CreateReactant("BHXH", 4),
                SpaceStoichiometry.CreateReactant("VRPVC", 14),
            ] }
        ];

        tests.forEach((test): void => {
            it(test.data, function() {
                const result = SpaceStoichiometry.ParseInput(test.data);
                assert.deepEqual(result, test.result);
            });
        });
    });

    describe("ParseRecipe", function() {
        const tests = [
            { data: "10 ORE => 10 A", result: { input: [SpaceStoichiometry.CreateReactant("ORE", 10)], output: SpaceStoichiometry.CreateReactant("A", 10)} },
            { data: "7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL", result: { input: [SpaceStoichiometry.CreateReactant("ZLQW", 7), SpaceStoichiometry.CreateReactant("BMBT", 3), SpaceStoichiometry.CreateReactant("XCVML", 9), SpaceStoichiometry.CreateReactant("XMNCP", 26), SpaceStoichiometry.CreateReactant("WPTQ", 1), SpaceStoichiometry.CreateReactant("MZWV", 2), SpaceStoichiometry.CreateReactant("RJRHP", 1)], output: SpaceStoichiometry.CreateReactant("PLWSL", 4) } }
        ];

        tests.forEach((test): void => {
            it(test.data, function() {
                const result = SpaceStoichiometry.ParseRecipe(test.data);
                assert.deepEqual(result, test.result);
            });
        });
    });

    describe("ExtractOrePerFuelCost", function() {
        const tests = [
            { data: data[0], result: 31 },
            { data: data[1], result: 165 },
            { data: data[2], result: 13312 },
            { data: data[3], result: 180697 },
            { data: data[4], result: 2210736 },
        ];

        tests.forEach((test, index): void => {
            it("Test " + index, function() {
                const stochiometry = new SpaceStoichiometry(test.data);
                const result = stochiometry.CalculateOrePerFuelCost();
                assert.equal(result, test.result);
            });
        });
    });

    describe("CalculateFuelPerTrillionOre", function() {
        const tests = [
            { data: data[2], result: 82892753 },
            { data: data[3], result: 5586022 },
            { data: data[4], result: 460664 },
        ];

        tests.forEach((test, index): void => {
            it("Test " + index, function() {
                const stochiometry = new SpaceStoichiometry(test.data);
                const result = stochiometry.CalculateFuelPerTrillionOre();
                assert.equal(result, test.result);
            });
        });
    });
});