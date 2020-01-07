"use strict";

// Eg: 12 HPRPM
type Reactant = {
    name: string;
    quantity: number;
}

// Eg: 12 HPRPM, 4 GTZCK => 7 DJNDX
type Recipe = {
    input: Reactant[];
    output: Reactant;
}

// Day 14
export class SpaceStoichiometry {
    private readonly _recipes: Recipe[];

    public constructor(recipes: string[]) {
        this._recipes = recipes.map((recipe: string): Recipe => SpaceStoichiometry.ParseRecipe(recipe));
    }

    public ExtractCost(): number {
        // Two arrays -- one "TO CREATE" and another "ALREADY CREATED"
        const toCreate = new Array<Reactant>({ name: "FUEL", quantity: 1 });
        const alreadyCreated = this._recipes.map((recipe: Recipe): Reactant => { return { name: recipe.output.name, quantity: 0 } });
        alreadyCreated.push({ name: "ORE", quantity: 0 });
        
        const getCreatedReactant = (chemical: string): Reactant => alreadyCreated.filter((r: Reactant): boolean => r.name == chemical)[0];
        const getRecipe = (chemical: string): Recipe => this._recipes.filter((recipe: Recipe): boolean => recipe.output.name == chemical)[0];

        while (toCreate.length > 0) {
            let currentToCreate = toCreate.shift();

            if (currentToCreate.name == "ORE") {
                if (toCreate.length == 0) { return currentToCreate.quantity; }
                toCreate.push(currentToCreate);
                currentToCreate = toCreate.shift();
            }

            // Reducing the overflow from other reactions
            const currentAlreadyCreated = getCreatedReactant(currentToCreate.name);
            if (currentAlreadyCreated.quantity >= currentToCreate.quantity) {
                currentAlreadyCreated.quantity -= currentToCreate.quantity;
                currentToCreate.quantity = 0;
            } else {
                currentToCreate.quantity -= currentAlreadyCreated.quantity;
                currentAlreadyCreated.quantity = 0;
            }

            // Next, need to find the multiplier and calculate the inputs
            if (currentToCreate.quantity > 0) {
                const recipe = getRecipe(currentToCreate.name);

                // Suppose 2A, 5B => 7C and we need 10C
                //  Multiplier is 2 ==> 1*7 < 10 <= 2*7
                //  Overflow is 2*7 - 10 == 4

                const multiplier = Math.ceil(currentToCreate.quantity / recipe.output.quantity);
                currentAlreadyCreated.quantity += (multiplier * recipe.output.quantity - currentToCreate.quantity);

                const inputs = recipe.input.map((r: Reactant): Reactant => { return { name: r.name, quantity: r.quantity * multiplier } });
                inputs.forEach((input: Reactant): void => {
                    const toCreateNode = toCreate.filter((r: Reactant): boolean => r.name == input.name);
                    if (toCreateNode.length > 0) {
                        toCreateNode[0].quantity += input.quantity;
                    } else {
                        toCreate.push(input);
                    }
                });
            }
        }

        return 0;
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
        return { name: groups[2], quantity: Number.parseInt(groups[1]) };
    }

    public static Day14Part1(): string {
        const input = ["9 RJLWC, 9 RJCH => 9 QWFH", "1 XZVHQ, 9 SPQR, 2 WKGVW => 5 KPZB", "12 HPRPM, 4 GTZCK => 7 DJNDX", "7 JKRV, 3 FKTLR, 19 FDSBZ => 9 HPRPM", "9 VTCRJ => 4 SPSW", "2 FDSBZ, 1 FKTLR => 6 KBJF", "9 SPSW => 9 QHVSJ", "5 TFPNF, 11 MNMBX, 1 QCMJ, 13 TXPL, 1 DJNDX, 9 XZVHQ, 2 WKGVW, 2 VQPX => 8 GPKR", "10 DWTC, 8 DSPJG => 4 QCMJ", "100 ORE => 9 XZDP", "3 DBRBD => 4 DKRX", "37 JKRV, 5 FKTLR => 7 VXZN", "3 HWDS, 2 ZRBN => 8 XZVHQ", "15 QNXZV, 53 VXZN, 3 LJQH, 13 FKXVQ, 6 DZGN, 17 MNMBX, 16 GPKR, 8 HWJVK => 1 FUEL", "8 GSLWP => 7 PWTFL", "4 HVPWG => 9 JKRV", "5 NVWGS, 1 QWFH, 9 CWZRS => 2 XPMV", "6 ZRBN => 4 JZDB", "36 BWXWC, 14 HKFD => 3 FMNK", "3 FMNK, 2 SPSW, 16 WKGVW => 6 VQPX", "1 DWTC => 9 VMHM", "3 HPRPM, 1 DWTC => 5 TXPL", "1 KBJF, 2 ZSKSW => 1 MNMBX", "5 JZDB => 4 FDSBZ", "2 FKXVQ => 9 ZTFZG", "17 XZDP => 2 HKFD", "7 VMHM => 3 FGQF", "1 JKRV => 8 CWZRS", "1 WKGVW, 2 SPSW => 6 VLQP", "3 ZRBN => 3 ZSKSW", "7 VXZN, 7 TGLHX => 5 NVWGS", "10 VLQP, 18 FGQF => 4 DBRBD", "8 VMHM => 8 SPQR", "1 KPZB, 4 GQGB, 3 WKGVW => 1 FDSZX", "2 VXZN => 8 VTCRJ", "3 RJLWC => 2 GQGB", "6 TXPL => 4 DSPJG", "2 ZTFZG => 8 TJLW", "1 MPSPS => 3 BWXWC", "5 FMNK, 4 ZSKSW => 5 RWKWD", "137 ORE => 3 MPSPS", "1 VTCRJ, 8 QWFH => 2 GKVQK", "8 RJLWC => 8 TFPNF", "7 TJLW, 1 TFPNF, 16 VQPX, 4 DBRBD, 4 GTZCK, 5 XPMV, 1 FDSZX => 6 DZGN", "1 HVPWG => 7 RJLWC", "18 HVPWG, 9 BWXWC => 4 GSLWP", "107 ORE => 8 RJCH", "1 RJCH => 2 ZRBN", "2 GSLWP, 18 RWKWD, 1 QWFH => 5 LJQH", "3 VXZN, 1 FMNK => 4 TGLHX", "3 HKFD, 6 FMNK => 3 FKTLR", "3 MPSPS => 4 HVPWG", "27 PWTFL, 15 ZTFZG, 6 QHVSJ, 14 DJNDX, 9 RWKWD, 2 MNMBX, 4 DKRX => 6 QNXZV", "1 ZSKSW, 9 KBJF => 3 FKXVQ", "2 FDSBZ => 4 DWTC", "3 HPRPM => 5 HWDS", "1 GKVQK, 1 PWTFL => 5 GTZCK", "1 FGQF => 5 WKGVW", "5 FDSBZ, 7 SPSW => 6 HWJVK"];
        const stoichiometry = new SpaceStoichiometry(input);
        const oreCost = stoichiometry.ExtractCost();
        return oreCost.toString();
    }
}