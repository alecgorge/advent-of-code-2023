const inp = await Bun.file(import.meta.dir + '/input.txt').text();

const tr: { [key: string]: string } = {
    'one': '1', 'two': '2', 'three': '3',
    'four': '4', 'five': '5', 'six': '6',
    'seven': '7', 'eight': '8', 'nine': '9',
};

const regex = new RegExp(`(?=(${Object.keys(tr).join("|")}|\\d))`, 'g');

const sum = inp
    .split("\n")
    .filter(l => l.length > 0)
    .map(l => [...l.trim().matchAll(regex)].map(m => tr[m[1]] || m[1]))
    .map(t => Number(t[0] + t[t.length - 1]))
    .reduce((acc, curr) => acc + curr)
;

console.log(sum);
