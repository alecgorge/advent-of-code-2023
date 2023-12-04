export async function inputLines(filename: string): Promise<string[]> {
    const inp = await Bun.file(filename).text();

    return inp
        .trim()
        .split("\n")
        .map(l => l.trim());
}
