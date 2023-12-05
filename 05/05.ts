interface Range {
    destinationRangeStart: number;
    sourceRangeStart: number;
    length: number
}

class FarmingMap {
    ranges: Range[] = [];

    constructor(private chunk: string) {
        const lines = chunk.split("\n");
        lines.shift();

        for (const line of lines) {
            const [
                destinationRangeStart,
                sourceRangeStart,
                length,
            ] = line.split(' ').map(n => Number(n));

            this.ranges.push({
                destinationRangeStart,
                sourceRangeStart,
                length,
            });
        }
    }

    mapSource(source: number) {
        for (const range of this.ranges) {
            if (source >= range.sourceRangeStart && source < range.sourceRangeStart + range.length) {
                return range.destinationRangeStart + (source - range.sourceRangeStart);
            }
        }

        return source;
    }

    mapRange()
}

class Almanac {
    constructor(
        public seeds: number[],
        private seedToSoilMap: FarmingMap,
        private soilToFertilizerMap: FarmingMap,
        private fertilizerToWaterMap: FarmingMap,
        private waterToLightMap: FarmingMap,
        private lightToTemperatureMap: FarmingMap,
        private temperatureToHumidityMap: FarmingMap,
        private humidityToLocationMap: FarmingMap,
    ) {
    }

    locationFromSeed(seed: number) {
        return this.humidityToLocationMap.mapSource(
            this.temperatureToHumidityMap.mapSource(
                this.lightToTemperatureMap.mapSource(
                    this.waterToLightMap.mapSource(
                        this.fertilizerToWaterMap.mapSource(
                            this.soilToFertilizerMap.mapSource(
                                this.seedToSoilMap.mapSource(seed)
                            )
                        )
                    )
                )
            )
        );
    }
}

function parseInput(contents: string) {
    const [
        chunkSeeds,
        chunkSeedToSoil,
        chunkSoilToFertilizer,
        chunkFertilizerToWater,
        chunkWaterToLight,
        chunkLightToTemperature,
        chunkTemperatureToHumidity,
        chunkHumidityToLocation,
    ] = contents.trim().split("\n\n");

    const seeds = chunkSeeds.split(': ')[1].split(' ').map(t => Number(t));

    return new Almanac(
        seeds,
        new FarmingMap(chunkSeedToSoil),
        new FarmingMap(chunkSoilToFertilizer),
        new FarmingMap(chunkFertilizerToWater),
        new FarmingMap(chunkWaterToLight),
        new FarmingMap(chunkLightToTemperature),
        new FarmingMap(chunkTemperatureToHumidity),
        new FarmingMap(chunkHumidityToLocation),
    );
}

const contents = await Bun.file(import.meta.dir + '/input2.txt').text();

function part1() {
    const almanac = parseInput(contents);

    return Math.min(...almanac.seeds.map(s => almanac.locationFromSeed(s)));
}

function part2() {
    const almanac = parseInput(contents);

    let minLocation: number|undefined = undefined;
    let processed = 0;

    for (let i = 0; i < almanac.seeds.length; i += 2) {
        const seedStart = almanac.seeds[i];
        const length = almanac.seeds[i + 1];

        for (let seed = seedStart; seed < seedStart + length; seed++) {
            const loc = almanac.locationFromSeed(seed);

            if (minLocation === undefined || loc < minLocation) {
                minLocation = loc;
            }

            processed++;

            if (processed % 10_000_000 === 0) {
                console.log(processed);
            }
        }
    }

    return minLocation;
}

console.log(part1());
console.log(part2());
