import {inputLines} from "../utils/input.ts";

const lines = await inputLines(import.meta.dir + '/input2.txt');

function cardScore(line: string) {
    const [left, numbers] = line.split(' | ');

    const [card, winners] = left.split(': ');

    const numbersSet = new Set(numbers.split(' ').filter(s => s.length > 0));
    const winnersSet = new Set(winners.split(' ').filter(s => s.length > 0));

    const intersection = new Set([...numbersSet].filter(x => winnersSet.has(x)));

    if (intersection.size === 0) {
        return [0, 0];
    }

    if (intersection.size === 1) {
        return [1, 1];
    }

    return [intersection.size, Math.pow(2, intersection.size - 1)];
}

function part1() {
    const scores = lines.map(cardScore);
    const sum = scores.reduce((acc, score) => acc + score[1], 0);

    return sum;
}

function part2() {
    const scores: number[] = Array(lines.length).fill(1);

    lines.forEach((line, idx) => {
        const [intersection, score] = cardScore(line);

        for (let i = idx + 1; i < idx + intersection + 1 && i < lines.length; i++) {
            // console.log(idx, intersection, i, scores);
            scores[i] = scores[i] + scores[idx];
        }
    });

    const sum = scores.reduce((acc, score) => acc + score);

    return sum;
}


console.log(part1());
console.log(part2());
