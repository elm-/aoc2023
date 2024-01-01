import { assert } from "console";
import * as fsPromise from "fs/promises";

const Unknown = "?";
const Working = ".";
const Broken = "#";

type Record = {
  springs: string[];
  damagedGroups: number[];
};




async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function parseInput(input: String): Record[] {
  return input.split("\n").map((line) => {
    const [springsStr, damagedGroupsStr] = line.split(" ");
    return {
      springs: springsStr.split(""),
      damagedGroups: damagedGroupsStr.split(",").map((char) => {
        return Number(char);
      }),
    }
  });
}

function isValid(springs: string[], checksum: number[]): boolean {
  springs.forEach((spring) => assert(spring === Working || spring === Broken));
  const damagedGroups = springs.join("").split(/\.+/).filter((s) => s !== "")
  return damagedGroups.length === checksum.length && damagedGroups.every((group, index) => group.length === checksum[index]);
}


function tryCombinations(record: Record): number {
  const generateCombinations = (springs: string[]): string[][] => {
    const options = (spring: string): string[] => spring === Unknown ? [Working, Broken] : [spring];
    if (springs.length === 0) {
      return [];
    } else {
      const [first, ...rest] = springs;
      const combinations = generateCombinations(rest);
      return options(first).reduce((acc, option) => {
        if (combinations.length === 0) {
          return [...acc, [option]];
        }  else {
          return [...acc, ...combinations.map((combination) => [option, ...combination])];
        }
      }, [] as string[][]);
    }
  }
  return generateCombinations(record.springs).filter((combination) => isValid(combination, record.damagedGroups)).length
}


async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const records = parseInput(text);
  return records.reduce((acc, record) => acc + BigInt(tryCombinations(record)), 0n);
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day12_test.txt", 21n);
runAndCheck("inputs/day12.txt", 7402n);
