export class Grid {
    constructor(public lines: string[]) {
    }

    get lineCount() {
        return this.lines.length;
    }

    get colCount() {
        return this.lines[0].length;
    }

    *visitAllPoints() {
        for (let l = 0; l < this.lineCount; l++) {
            for (let c = 0; c < this.colCount; c++) {
                yield new GridPoint(this, l, c);
            }
        }
    }

    *visitAllTokens(tokenizer: RegExp) {
        for (let l = 0; l < this.lineCount; l++) {
            const line = this.lines[l];

            for (const match of line.matchAll(tokenizer)) {
                if (match.index !== undefined) {
                    yield new GridToken(this, l, match.index, match.index + match[0].length - 1);
                }
            }
        }
    }
}

function pointsAreAdjacent(l1: number, c1: number, l2: number, c2: number) {
    return Math.abs(l1 - l2) <= 1 && Math.abs(c1 - c2) <= 1;
}

export class GridToken {
    constructor(public grid: Grid, public line: number, public startCol: number, public lastCol: number) {

    }

    get value() {
        return this.grid.lines[this.line].substring(this.startCol, this.lastCol + 1);
    }

    startPoint() {
        return new GridPoint(this.grid, this.line, this.startCol);
    }

    *visitAdjacentPoints() {
        for (let l = Math.max(0, this.line - 1); l <= Math.min(this.line + 1, this.grid.lineCount - 1); l++) {
            for (let c = Math.max(0, this.startCol - 1); c <= Math.min(this.lastCol + 1, this.grid.colCount - 1); c++) {
                if (l === this.line && c >= this.startCol && c <= this.lastCol) {
                    continue;
                }

                yield new GridPoint(this.grid, l, c);
            }
        }
    }

    toString() {
        return `TokenizedGridToken(line=${this.line}, startCol=${this.startCol}, lastCol=${this.lastCol}, value=${this.value})`;
    }

}

export class GridPoint {
    constructor(public grid: Grid, public line: number, public col: number) {

    }

    get value() {
        return this.grid.lines[this.line][this.col];
    }

    *visitAdjacentPoints() {
        for (let l = Math.max(0, this.line - 1); l <= Math.min(this.line + 1, this.grid.lineCount - 1); l++) {
            for (let c = Math.max(0, this.col - 1); c <= Math.min(this.col + 1, this.grid.colCount - 1); c++) {
                if (l === this.line && c === this.col) {
                    continue;
                }

                yield new GridPoint(this.grid, l, c);
            }
        }
    }

    *visitAdjacentTokens(tokenizer: RegExp) {
        for (let l = Math.max(0, this.line - 1); l <= Math.min(this.line + 1, this.grid.lineCount - 1); l++) {
            const line = this.grid.lines[l];

            for (const match of line.matchAll(tokenizer)) {
                if (match.index !== undefined) {
                    const startCol = match.index;
                    const lastCol = match.index + match[0].length - 1;

                    for (let c = startCol; c <= lastCol; c++) {
                        if (pointsAreAdjacent(this.line, this.col, l, c)) {
                            yield new GridToken(this.grid, l, startCol, lastCol);
                            break;
                        }
                    }
                }
            }
        }
    }


    toString() {
        return `GridPoint(line=${this.line}, col=${this.col}, value=${this.value})`;
    }
}

