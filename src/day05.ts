import { assert } from "console";
import * as fsPromise from "fs/promises";


type Seeds = number[];
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
  return file.readFile({ encoding: "utf-8" });
}

function parseInput(input: String): [Seeds, MappingData[]] {
  const [seedsStr, ...mapStrings] = input.split("\n\n");
  const seeds = /seeds: ([\d ]+)/.exec(seedsStr)[1].split(" ").map((seed) => Number(seed));
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


function mapThrough(seed: number, mappings: MappingData[]): number {
  const mapNumber = (n: number, mapping: MappingData): number => {
    const range = mapping.ranges.find((range) => {
      return (range.from <= n && n < (range.from + range.length));
    });
    if (range) {
      return n + (range.to - range.from)
    } else {
      return n;
    }
  }
  return mappings.reduce((n, mapping) => mapNumber(n, mapping), seed);
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

runAndCheck("inputs/day05_test.txt", 35n);
runAndCheck("inputs/day05.txt", 389056265n);
