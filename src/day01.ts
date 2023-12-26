import { assert } from 'console';
import * as fsPromise from 'fs/promises';

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
  const digitRegex = /\d/;
  const testFn = (c: string) => digitRegex.test(c);
  return input.reduce((sum: bigint, line: string[]) => {
    return sum + BigInt(Number(line.find(testFn)) * 10 + Number(line.findLast(testFn)));
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


runAndCheck("inputs/day01_test.txt", 142n);

runAndCheck("inputs/day01.txt", 54338n);
