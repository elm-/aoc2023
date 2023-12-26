import { assert } from 'console';
import * as fsPromise from 'fs/promises';

const Empty = ".";
const Galaxy = "#";


async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, 'r');
  return file.readFile({ encoding: 'utf-8' });
}

function parseInput(input: String): string[][] {
  return input.split("\n").map((line) => {
    return line.split("").map((char) => {
      return char;
    });
  });
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);
  return 0n;
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);
  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("src/day11_test.txt", 374n);
runAndCheck("src/day11_test.txt", 1030n);

runAndCheck("src/day11.txt", 10276166n);
runAndCheck("src/day11.txt", 598693078798n);
