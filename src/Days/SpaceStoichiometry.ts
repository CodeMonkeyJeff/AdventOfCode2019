"use strict";

// Eg: 12 HPRPM
type Reactant = {
    readonly name: string;
    quantity: number;
}

// Eg: 12 HPRPM, 4 GTZCK => 7 DJNDX
type Recipe = {
    readonly input: Reactant[];
    readonly output: Reactant;
}

// Day 14
export class SpaceStoichiometry {
    private readonly _recipes: Recipe[];
    private readonly _overflow: Reactant[];
    private readonly _tiers: { [chemical: string]: number };    

    public constructor(recipes: string[]) {
        this._recipes = recipes.map((recipe: string): Recipe => SpaceStoichiometry.ParseRecipe(recipe));
        this._overflow = new Array<Reactant>();
        this.resetOverflow();

        this._tiers = {};
        this._tiers["ORE"] = 0;
        this.setTier("FUEL");
    }

    private resetOverflow(): void {
        if (this._overflow.length == 0) {
            this._overflow.push(...this._recipes.map((recipe: Recipe): Reactant => { return SpaceStoichiometry.CreateReactant(recipe.output.name, 0) }));
            this._overflow.push(SpaceStoichiometry.CreateReactant("ORE", 0));
        } else {
            this._overflow.forEach((r: Reactant): void => { r.quantity = 0; });
        }
    }

    private setTier(chemical: string): number { 
        if (this._tiers[chemical] === undefined) {
            const recipe = this.getRecipe(chemical);
            this._tiers[chemical] = 1 + Math.max(...recipe.input.map((r: Reactant): number => this.setTier(r.name)));
        }
        return this._tiers[chemical];
    }
    private getRecipe(chemical: string): Recipe { return this._recipes.filter((recipe: Recipe): boolean => recipe.output.name == chemical)[0];}
    private getReactantFromList(list: Reactant[], chemical: string): Reactant {
        const reactants = list.filter((r: Reactant): boolean => r.name == chemical);
        if (reactants.length == 0) { return null; }
        return reactants[0];
    }

    private getReactantStock(chemical: string): Reactant { return this.getReactantFromList(this._overflow, chemical); }
    public CalculateMultiplier(reactant: Reactant): number {
        // The multiplier is how many times in a row we have to
        //  run a recipe.  For example, suppose we need 12 moles
        //  of YYYY but the recipe yields 5 moles.  Then, we have
        //  a multiplier of 3
        //
        //  muliplier := NEED / yield
        //

        return Math.ceil(reactant.quantity / this.getRecipe(reactant.name).output.quantity);
    }

    public ReduceReactant(reactant: Reactant): Reactant {        
        const overflowReactant = this.getReactantStock(reactant.name);      // Get the overflow reactant to adjust
        const differential = Math.min(overflowReactant.quantity, reactant.quantity);
        overflowReactant.quantity -= differential;
        reactant.quantity -= differential;

        if (overflowReactant.quantity < 0) { throw new Error("overflowReactant is negative"); }
        if (reactant.quantity < 0) { throw new Error("reactant is negative"); }

        return reactant;
    }

    public GetHighestTierReactant(reactants: Reactant[]): Reactant {
        if (reactants.length == 0) { return undefined }        
        return reactants.sort((first: Reactant, second: Reactant): number => this._tiers[second.name] - this._tiers[first.name]).shift();
    }

    public AddToReactantList(list: Reactant[], reactant: Reactant): SpaceStoichiometry {
        const target = this.getReactantFromList(list, reactant.name);
        if (target != null) { target.quantity += reactant.quantity; }
        if (target == null) { list.push(SpaceStoichiometry.CreateReactant(reactant.name, reactant.quantity)); }
        return this;
    }

    public OutputOreRequirement(): number {
        const ore = this.getReactantStock("ORE");
        const quantity = ore.quantity;
        ore.quantity = 0;
        return quantity;
    }

    public CreateFUEL(fuelAmount = 1): SpaceStoichiometry {
        // "toCreate" is a list of reagents that need to be created
        const toCreate = new Array<Reactant>(SpaceStoichiometry.CreateReactant("FUEL", fuelAmount));
        while (toCreate.length > 0) {
            const current = this.GetHighestTierReactant(toCreate);

            // If current is ORE then all other requirements have been satisfied...
            if (current.name == "ORE") { this.getReactantStock("ORE").quantity += current.quantity; return this; }

            // Otherwise, we need to create the yield.  We first need to check overflow to see if we have any in "stock"
            this.ReduceReactant(current);                           // Don't recreate it if we have leftovers
            const multiplier = this.CalculateMultiplier(current);   // We need to execute the recipe this many times
            const recipe = this.getRecipe(current.name);            // Need the recipe for the next few steps

            // To execute the recipe, we will need to create each reagent... Add them to the "toCreate" list
            recipe.input.map((r: Reactant): Reactant => SpaceStoichiometry.CreateReactant(r.name, r.quantity * multiplier)).forEach((r: Reactant): void => { this.AddToReactantList(toCreate, r); });
            
            // Suppose we required 12 mole and the recipe yields 5 mole.  Then, the multiplier is 3,
            //  the overall yield was 15, so the overflow was 3.

            // We can now mark this yield as created and push any overflow to the overflow list
            this.getReactantStock(current.name).quantity = (recipe.output.quantity * multiplier) - current.quantity;
        }

        return this;
    }

    public CalculateOrePerFuelCost(fuelAmount = 1): number {
        this.resetOverflow();
        return this.CreateFUEL(fuelAmount).OutputOreRequirement(); 
    }

    public CalculateFuelPerTrillionOre(): number {
        const trillion = 1000000000000;

        // First, calculate the raw ore cost.  This is our lower bound for fuel.
        let lowerBound = Math.ceil(trillion / this.CalculateOrePerFuelCost(1));

        // Second, calculate an upper bound by multiplying the lower bound
        let upperBound = 10 * lowerBound;
        while (this.CalculateOrePerFuelCost(upperBound) < trillion) { upperBound *= 2; }

        // Finally, divide by half until we find the solution
        const runLoop = true;   // HACKY to get around eslint
        while (runLoop) {
            const midpoint = lowerBound + Math.floor((upperBound - lowerBound) / 2);    // Fuel count guess
            const guess = this.CalculateOrePerFuelCost(midpoint);                       // Total ore needed                            
            if (guess == trillion) { return midpoint; }                                 // Edge case that midpoint is exactly one trillion
            if (guess > trillion) { upperBound = midpoint; } 
            else {
                const upperGuess = this.CalculateOrePerFuelCost(midpoint + 1);
                if (upperGuess > trillion) { return midpoint; }
                lowerBound = midpoint + 1;
            }
        }
    }

    public static ParseRecipe(raw: string): Recipe {
        const groups = raw.split(/=>/);
        const input = SpaceStoichiometry.ParseInput(groups[0].trim());
        const output = SpaceStoichiometry.ParseReactant(groups[1].trim());

        return { input: input, output: output };
    }

    public static ParseInput(raw: string): Reactant[] {
        const groups = raw.split(/[,]\s*/);
        return groups.map(SpaceStoichiometry.ParseReactant);
    }

    public static ParseReactant(raw: string): Reactant {
        const regex = new RegExp("(^\\d*) (\\w*$)");    //* Example:  7 ZLQW
        const groups = regex.exec(raw);
        return SpaceStoichiometry.CreateReactant(groups[2], Number.parseInt(groups[1]));
    }

    public static CreateReactant(name: string, quantity: number): Reactant { return { name: name, quantity: quantity }; }

    public static Day14Part1(): string {
        const input = ["9 RJLWC, 9 RJCH => 9 QWFH", "1 XZVHQ, 9 SPQR, 2 WKGVW => 5 KPZB", "12 HPRPM, 4 GTZCK => 7 DJNDX", "7 JKRV, 3 FKTLR, 19 FDSBZ => 9 HPRPM", "9 VTCRJ => 4 SPSW", "2 FDSBZ, 1 FKTLR => 6 KBJF", "9 SPSW => 9 QHVSJ", "5 TFPNF, 11 MNMBX, 1 QCMJ, 13 TXPL, 1 DJNDX, 9 XZVHQ, 2 WKGVW, 2 VQPX => 8 GPKR", "10 DWTC, 8 DSPJG => 4 QCMJ", "100 ORE => 9 XZDP", "3 DBRBD => 4 DKRX", "37 JKRV, 5 FKTLR => 7 VXZN", "3 HWDS, 2 ZRBN => 8 XZVHQ", "15 QNXZV, 53 VXZN, 3 LJQH, 13 FKXVQ, 6 DZGN, 17 MNMBX, 16 GPKR, 8 HWJVK => 1 FUEL", "8 GSLWP => 7 PWTFL", "4 HVPWG => 9 JKRV", "5 NVWGS, 1 QWFH, 9 CWZRS => 2 XPMV", "6 ZRBN => 4 JZDB", "36 BWXWC, 14 HKFD => 3 FMNK", "3 FMNK, 2 SPSW, 16 WKGVW => 6 VQPX", "1 DWTC => 9 VMHM", "3 HPRPM, 1 DWTC => 5 TXPL", "1 KBJF, 2 ZSKSW => 1 MNMBX", "5 JZDB => 4 FDSBZ", "2 FKXVQ => 9 ZTFZG", "17 XZDP => 2 HKFD", "7 VMHM => 3 FGQF", "1 JKRV => 8 CWZRS", "1 WKGVW, 2 SPSW => 6 VLQP", "3 ZRBN => 3 ZSKSW", "7 VXZN, 7 TGLHX => 5 NVWGS", "10 VLQP, 18 FGQF => 4 DBRBD", "8 VMHM => 8 SPQR", "1 KPZB, 4 GQGB, 3 WKGVW => 1 FDSZX", "2 VXZN => 8 VTCRJ", "3 RJLWC => 2 GQGB", "6 TXPL => 4 DSPJG", "2 ZTFZG => 8 TJLW", "1 MPSPS => 3 BWXWC", "5 FMNK, 4 ZSKSW => 5 RWKWD", "137 ORE => 3 MPSPS", "1 VTCRJ, 8 QWFH => 2 GKVQK", "8 RJLWC => 8 TFPNF", "7 TJLW, 1 TFPNF, 16 VQPX, 4 DBRBD, 4 GTZCK, 5 XPMV, 1 FDSZX => 6 DZGN", "1 HVPWG => 7 RJLWC", "18 HVPWG, 9 BWXWC => 4 GSLWP", "107 ORE => 8 RJCH", "1 RJCH => 2 ZRBN", "2 GSLWP, 18 RWKWD, 1 QWFH => 5 LJQH", "3 VXZN, 1 FMNK => 4 TGLHX", "3 HKFD, 6 FMNK => 3 FKTLR", "3 MPSPS => 4 HVPWG", "27 PWTFL, 15 ZTFZG, 6 QHVSJ, 14 DJNDX, 9 RWKWD, 2 MNMBX, 4 DKRX => 6 QNXZV", "1 ZSKSW, 9 KBJF => 3 FKXVQ", "2 FDSBZ => 4 DWTC", "3 HPRPM => 5 HWDS", "1 GKVQK, 1 PWTFL => 5 GTZCK", "1 FGQF => 5 WKGVW", "5 FDSBZ, 7 SPSW => 6 HWJVK"];
        const stoichiometry = new SpaceStoichiometry(input);
        const oreCost = stoichiometry.CalculateOrePerFuelCost();
        return oreCost.toString();
    }

    public static Day14Part2(): string {
        const input = ["9 RJLWC, 9 RJCH => 9 QWFH", "1 XZVHQ, 9 SPQR, 2 WKGVW => 5 KPZB", "12 HPRPM, 4 GTZCK => 7 DJNDX", "7 JKRV, 3 FKTLR, 19 FDSBZ => 9 HPRPM", "9 VTCRJ => 4 SPSW", "2 FDSBZ, 1 FKTLR => 6 KBJF", "9 SPSW => 9 QHVSJ", "5 TFPNF, 11 MNMBX, 1 QCMJ, 13 TXPL, 1 DJNDX, 9 XZVHQ, 2 WKGVW, 2 VQPX => 8 GPKR", "10 DWTC, 8 DSPJG => 4 QCMJ", "100 ORE => 9 XZDP", "3 DBRBD => 4 DKRX", "37 JKRV, 5 FKTLR => 7 VXZN", "3 HWDS, 2 ZRBN => 8 XZVHQ", "15 QNXZV, 53 VXZN, 3 LJQH, 13 FKXVQ, 6 DZGN, 17 MNMBX, 16 GPKR, 8 HWJVK => 1 FUEL", "8 GSLWP => 7 PWTFL", "4 HVPWG => 9 JKRV", "5 NVWGS, 1 QWFH, 9 CWZRS => 2 XPMV", "6 ZRBN => 4 JZDB", "36 BWXWC, 14 HKFD => 3 FMNK", "3 FMNK, 2 SPSW, 16 WKGVW => 6 VQPX", "1 DWTC => 9 VMHM", "3 HPRPM, 1 DWTC => 5 TXPL", "1 KBJF, 2 ZSKSW => 1 MNMBX", "5 JZDB => 4 FDSBZ", "2 FKXVQ => 9 ZTFZG", "17 XZDP => 2 HKFD", "7 VMHM => 3 FGQF", "1 JKRV => 8 CWZRS", "1 WKGVW, 2 SPSW => 6 VLQP", "3 ZRBN => 3 ZSKSW", "7 VXZN, 7 TGLHX => 5 NVWGS", "10 VLQP, 18 FGQF => 4 DBRBD", "8 VMHM => 8 SPQR", "1 KPZB, 4 GQGB, 3 WKGVW => 1 FDSZX", "2 VXZN => 8 VTCRJ", "3 RJLWC => 2 GQGB", "6 TXPL => 4 DSPJG", "2 ZTFZG => 8 TJLW", "1 MPSPS => 3 BWXWC", "5 FMNK, 4 ZSKSW => 5 RWKWD", "137 ORE => 3 MPSPS", "1 VTCRJ, 8 QWFH => 2 GKVQK", "8 RJLWC => 8 TFPNF", "7 TJLW, 1 TFPNF, 16 VQPX, 4 DBRBD, 4 GTZCK, 5 XPMV, 1 FDSZX => 6 DZGN", "1 HVPWG => 7 RJLWC", "18 HVPWG, 9 BWXWC => 4 GSLWP", "107 ORE => 8 RJCH", "1 RJCH => 2 ZRBN", "2 GSLWP, 18 RWKWD, 1 QWFH => 5 LJQH", "3 VXZN, 1 FMNK => 4 TGLHX", "3 HKFD, 6 FMNK => 3 FKTLR", "3 MPSPS => 4 HVPWG", "27 PWTFL, 15 ZTFZG, 6 QHVSJ, 14 DJNDX, 9 RWKWD, 2 MNMBX, 4 DKRX => 6 QNXZV", "1 ZSKSW, 9 KBJF => 3 FKXVQ", "2 FDSBZ => 4 DWTC", "3 HPRPM => 5 HWDS", "1 GKVQK, 1 PWTFL => 5 GTZCK", "1 FGQF => 5 WKGVW", "5 FDSBZ, 7 SPSW => 6 HWJVK"];
        const stoichiometry = new SpaceStoichiometry(input);
        const maxFuelReturn = stoichiometry.CalculateFuelPerTrillionOre();
        return maxFuelReturn.toString();
    }
}