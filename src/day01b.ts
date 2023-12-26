import { assert } from "console";
import * as fsPromise from "fs/promises";

const WordMap = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9
};

async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function parseInput(input: String): string[] {
  return input.split("\n");
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);

  return input.reduce((sum: bigint, line: string) => {
    const [, first] = Object.keys(WordMap).reduce(([minIndex, value], word) => {
      const index = line.indexOf(word);
      if (index !== -1 && index < minIndex) {
        return [index, WordMap[word]];
      } else {
        return [minIndex, value];
      }
    }, [Number.POSITIVE_INFINITY, 0]);
    const [, last] = Object.keys(WordMap).reduce(([maxIndex, value], word) => {
      const index = line.lastIndexOf(word);
      if (index !== -1 && index > maxIndex) {
        return [index, WordMap[word]];
      } else {
        return [maxIndex, value];
      }
    }, [Number.NEGATIVE_INFINITY, 0]);
    assert(first !== 0 && last !== 0, `first (${first}) and last (${last}) should not be 0 (${line})`)
    return sum + BigInt(first * 10 + last);
  }, 0n);
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}

runAndCheck("inputs/day01b_test.txt", 281n);
runAndCheck("inputs/day01.txt", 53389n);
