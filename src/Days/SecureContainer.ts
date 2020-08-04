"use strict";

export class SecureContainer {
    private static readonly lowerBound = 193651;
    private static readonly upperBound = 649729;
    
    public static CheckPasswordPart1(password: number): boolean {        
        let isValid = true;

        // Value is six digits
        isValid = isValid && (password > 100000);
        isValid = isValid && (password <= 999999);
        
        // Digits nondecreasing
        let hasAdjacentDigitGroup = false;
        while (password > 0) {
            const current = password % 10;
            password = Math.floor(password / 10);
            hasAdjacentDigitGroup = hasAdjacentDigitGroup || ((password % 10) == current)
            isValid = isValid && ((password % 10) <= current);
        }
        isValid = isValid && hasAdjacentDigitGroup;

        return isValid;
    }

    public static CheckPasswordPart2(password: number): boolean {        
        let isValid = true;

        // Value is six digits
        isValid = isValid && (password > 100000);
        isValid = isValid && (password <= 999999);

        // Two adjacent digits are present, but only in one grouping
        let hasAdjacentDigitGroup = false;
        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((val: number) => {
            const str = password.toString();
            hasAdjacentDigitGroup = hasAdjacentDigitGroup || (str.split(val.toString()).length == 3);
        });
        isValid = isValid && hasAdjacentDigitGroup;

        // Digits nondecreasing
        while (password > 0) {
            const current = password % 10;
            password = Math.floor(password / 10);            
            isValid = isValid && ((password % 10) <= current);
        }


        return isValid;
    }

    public static Day4Part1(): string {
        let count = 0;
        for (let i = SecureContainer.lowerBound; i < SecureContainer.upperBound; i++) {
            if (SecureContainer.CheckPasswordPart1(i)) { count++; }
        }

        return count.toString();
    }

    public static Day4Part2(): string {
        let count = 0;
        for (let i = SecureContainer.lowerBound; i < SecureContainer.upperBound; i++) {
            if (SecureContainer.CheckPasswordPart2(i)) { count++; }
        }

        return count.toString();
    }
}