import {inputLines} from "../utils/input.ts";
import {Grid, GridToken} from "../utils/grid.ts";

const lines = await inputLines(import.meta.dir + '/input2.txt');

function part1() {
    const partNumbers: number[] = [];

    const grid = new Grid(lines);

    for (const token of grid.visitAllTokens(/\d+/g)) {
        for (const adjacent of token.visitAdjacentPoints()) {
            if (adjacent.value.match(/^[^0-9.]$/) !== null) {
                partNumbers.push(Number(token.value));
                break;
            }
        }
    }

    const sum = partNumbers.reduce((acc, val) => acc + val);

    return sum;
}

function part2() {
    const gearRatios: number[] = [];

    const grid = new Grid(lines);

    for (const token of grid.visitAllTokens(/[*]/g)) {
        const adjParts: GridToken[] = [...token.startPoint().visitAdjacentTokens(/\d+/g)];

        if (adjParts.length === 2) {
            const gearRatio = adjParts.reduce((acc, val) => acc * Number(val.value), 1);

            gearRatios.push(gearRatio);
        }
    }

    const sum = gearRatios.reduce((acc, val) => acc + val);

    return sum;
}

console.log(part1());
console.log(part2());
