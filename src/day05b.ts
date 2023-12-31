import { assert } from "console";
import * as fsPromise from "fs/promises";

type Range = {
  from: number;
  length: number;
}
type Seeds = Range[];

type RangeMap = {
  from: number;
  to: number;
  length: number;
}
type MappingData = {
  name: string;
  ranges: RangeMap[];
}

async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function parseInput(input: String): [Seeds, MappingData[]] {
  const [seedsStr, ...mapStrings] = input.split("\n\n");
  const seedNumbers = /seeds: ([\d ]+)/.exec(seedsStr)[1].split(" ").map((seed) => Number(seed));
  const seeds: Seeds = [];
  for (var i = 0; i < seedNumbers.length; i += 2) {
    seeds.push({
      from: seedNumbers[i],
      length: seedNumbers[i + 1]
    });
  }
  const mappings = mapStrings.map((mapString) => {
    const [name, ...rangesStr] = mapString.split("\n");
    const ranges = rangesStr.map((rangeStr) => {
      const [to, from, length] = rangeStr.split(" ").map((num) => Number(num));
      return {
        from: from,
        to: to,
        length: length
      };
    });
    return {
      name: name,
      ranges: ranges
    };
  });
  return [seeds, mappings];
}


function mapThrough(seed: Range, mappings: MappingData[]): number {
  const mapRange = (r: Range, mapping: MappingData): Range[] => {
    return mapping.ranges.reduce((mappedRanges, mapRange) => {
      // TODO: review this code
      // check inside range completely
      if (mapRange.from <= r.from && r.from + r.length <= mapRange.from + mapRange.length) {
        mappedRanges.push({
          from: r.from + (mapRange.to - mapRange.from),
          length: r.length
        });
      } else if (mapRange.from <= r.from && r.from + r.length > mapRange.from + mapRange.length) {
        // check inside range partially
        mappedRanges.push({
          from: r.from + (mapRange.to - mapRange.from),
          length: mapRange.length - (r.from + r.length - mapRange.from)
        });
      } else if (mapRange.from > r.from && r.from + r.length <= mapRange.from + mapRange.length) {
        // check outside range partially
        mappedRanges.push({
          from: mapRange.from + (r.from - mapRange.from) + (mapRange.to - mapRange.from),
          length: r.length
        });
      } else {
        // check outside range completely
        mappedRanges.push({
          from: r.from,
          length: r.length
        });
      }
      return mappedRanges;
    }, []);
  };
  const testR1 = mapRange(
    { from: 0, length: 10 },
    { name: "test", ranges: [{ from: 20, to: 30, length: 10 }] }
  );
  const testR2 = mapRange(
    { from: 20, length: 10 },
    { name: "test", ranges: [{ from: 20, to: 5, length: 10 }] }
  );
  const testR3 = mapRange(
    { from: 15, length: 10 },
    { name: "test", ranges: [{ from: 20, to: 5, length: 10 }] }
  );
  const testR4 = mapRange(
    { from: 79, length: 14 },
    { name: "test", ranges: [{ from: 98, to: 50, length: 2 }, { from: 50, to: 52, length: 48 }] }
  );
  assert(testR1.length === 1, `testR1 length: ${testR1.length}`);
  assert(testR1[0].from === 0, `testR1 from: ${testR1[0].from}`);
  assert(testR1[0].length === 10, `testR1[0] length: ${testR1[0].length}`);
  assert(testR2.length === 1, `testR2 length: ${testR2.length}`);
  assert(testR2[0].from === 5, `testR2 from: ${testR2[0].from}`);
  assert(testR2[0].length === 10, `testR2[0] length: ${testR2[0].length}`);
  assert(testR3.length === 2, `testR3 length: ${testR3.length}`);
  assert(testR3[0].from === 15, `testR3 from: ${testR3[0].from}`);
  assert(testR3[0].length === 5, `testR3[0] length: ${testR3[0].length}`);
  assert(testR3[1].from === 5, `testR3 from: ${testR3[1].from}`);
  assert(testR3[1].length === 5, `testR3[1] length: ${testR3[1].length}`);
  assert(testR4.length === 1, `testR4 length: ${testR4.length}`);
  assert(testR4[0].from === 81, `testR4 from: ${testR4[0].from}`);
  assert(testR4[0].length === 14, `testR4[0] length: ${testR4[0].length}`);
  const mapRanges = (ranges: Range[], mapping: MappingData): Range[] => {
    return ranges.reduce((mappedRanges, r) => {
      const newRanges = mapRange(r, mapping);
      console.log(mapping.name, r, mapping.ranges);
      console.log(newRanges);
      return mappedRanges.concat(newRanges);
    }, []);
  };
  return mappings.reduce((rs, mapping) => mapRanges(rs, mapping), [seed]).reduce((min, range) => Math.min(min, range.from), Number.POSITIVE_INFINITY);
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const [seeds, mappings] = parseInput(text);
  return BigInt(seeds.map((seed) => mapThrough(seed, mappings)).reduce((min, b) => Math.min(min, b), Number.POSITIVE_INFINITY));
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}

runAndCheck("inputs/day05_test.txt", 46n);
// runAndCheck("inputs/day05.txt", 389056265n);
