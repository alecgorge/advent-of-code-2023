class Draw {
    constructor(
        public red: number = 0,
        public green: number = 0,
        public blue: number = 0,
    ) {
    }

    isCompatibleWithBag(bag: Bag) {
        return this.red <= bag.red && this.green <= bag.green && this.blue <= bag.blue;
    }

    power() {
        return this.red * this.green * this.blue;
    }
}

type Bag = Draw;

class Game {
    constructor(
        public id: number,
        public draws: Draw[],
    ) {
    }

    isCompatibleWithBag(bag: Bag) {
        for (const draw of this.draws) {
            if (!draw.isCompatibleWithBag(bag)) {
                return false;
            }
        }

        return true;
    }

    minimumBag() {
        const bag: Bag = new Draw(0, 0, 0);

        for (const draw of this.draws) {
            if (draw.red > bag.red) {
                bag.red = draw.red;
            }
            if (draw.green > bag.green) {
                bag.green = draw.green;
            }
            if (draw.blue > bag.blue) {
                bag.blue = draw.blue;
            }
        }

        return bag;
    }
}

function parseDraw(input: string) {
    const d = new Draw();
    for (const single of input.trim().split(", ")) {
        const [num, color] = single.split(' ');

        (d as any)[color] = Number(num);
    }

    return d;
}

function parseGameLine(input: string): Game {
    const [game_name, game] = input.trim().split(": ");

    return new Game(+game_name.split(" ")[1], game.split(";").map(parseDraw));
}

const inp = await Bun.file(import.meta.dir + '/input2.txt').text();
const bag: Bag = new Draw(12, 13, 14);

const games = inp
    .trim()
    .split("\n")
    .map(parseGameLine);

const r1 = games
    .filter(g => g.isCompatibleWithBag(bag))
    .map(g => g.id)
    .reduce((acc, num) => acc + num)
;

const r2 = games
    .map(g => g.minimumBag().power())
    .reduce((acc, num) => acc + num)
;

console.log(r1, r2);
