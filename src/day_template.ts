import { assert } from "console";
import * as fsPromise from "fs/promises";

async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
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


runAndCheck("inputs/day00_test.txt", 0n);
runAndCheck("inputs/day00.txt", 0n);
