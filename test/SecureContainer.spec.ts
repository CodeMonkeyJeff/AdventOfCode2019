"use strict";

import assert = require("assert");
import { SecureContainer } from "../src/Days/SecureContainer";

describe("Day 04 -- SecureContainer", function(): void {
    describe("CheckPasswordPart1", function(): void {
        const tests = [
            { password: 111111, result: true },
            { password: 199999, result: true },
            { password: 223450, result: false },
            { password: 234567, result: false },
            { password: 123789, result: false },
            { password: 678999, result: true  },
            { password: 112233, result: true  },
            { password: 111122, result: true  }
        ];

        tests.forEach((test): void => {
            it(test.password.toString(), function(): void {
                const isValid = SecureContainer.CheckPasswordPart1(test.password);
                assert.equal(test.result, isValid);
            });
        });
    });

    describe("CheckPasswordPart2", function(): void {
        const tests = [
            { password: 111111, result: false },
            { password: 199999, result: false },
            { password: 223450, result: false },
            { password: 234567, result: false },
            { password: 123789, result: false },
            { password: 678999, result: false },
            { password: 112233, result: true  },
            { password: 111122, result: true  }
        ];

        tests.forEach((test): void => {
            it(test.password.toString(), function(): void {
                const isValid = SecureContainer.CheckPasswordPart2(test.password);
                assert.equal(test.result, isValid);
            });
        });
    });
});