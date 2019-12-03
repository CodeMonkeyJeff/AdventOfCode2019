"use strict";

export class TyrannyOfRocketEquation {
    private static readonly _input = [  56017,  141632, 71303,  148129, 59828,  83478,  136501, 97611,  92298,  107697, 
                                        102886, 57037,  58458,  121031, 119944, 147894, 110097, 146857, 137133, 126985,
                                        81583,  106275, 130025, 99276,  76704,  105244, 111534, 110405, 88847,  106736,
                                        109562, 112705, 50061,  146911, 143213, 126404, 131161, 82251,  56396,  86306,
                                        110074, 94474,  113640, 60274,  102171, 97755,  142020, 100304, 100155, 80432,
                                        124345, 79730,  105762, 114971, 141583, 135170, 87585,  105794, 101571, 62313,
                                        62865,  136660, 121434, 67603,  53325,  76232,  93160,  99580,  90716,  102187,
                                        115997, 134281, 64593,  87597,  131885, 68041,  88209,  136400, 127058, 141613,
                                        66822,  62441,  136063, 134204, 52078,  135123, 95428,  91311,  55524,  97099,
                                        80454,  91710,  130396, 130089, 127464, 86160,  53158,  64908,  98321,  112176
                                    ];

    public static GetFuel(mass: number): number {
        const fuel = Math.floor(mass / 3) - 2;
        return fuel >= 0 ? fuel : 0;
    }
    
    public static GetRecursiveFuel(mass: number): number {
        let fuel = this.GetFuel(mass);        
        if (fuel > 0) { fuel += this.GetRecursiveFuel(fuel); }
        return fuel;
    }

    public static Day1Part1(): string { return this._input.map((val: number): number => this.GetFuel(val)).reduce((total: number, val: number) => total + val).toString(); }
    public static Day1Part2(): string { return this._input.map((val: number) => this.GetRecursiveFuel(val)).reduce((total: number, val: number) => total + val).toString(); }
}