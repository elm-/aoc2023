import { assert } from "console";
import * as fsPromise from "fs/promises";

const Empty = ".";
const isNumber = (char: string): boolean => {
  return !isNaN(Number(char));
}

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


function isStandalone(input: string[][], digitCoordinates: [number, number][], digits: string): boolean {
  return digitCoordinates.reduce((empty, [x, y]) => {
    for (let y2 = y - 1; y2 <= y + 1; y2++) {
      for (let x2 = x - 1; x2 <= x + 1; x2++) {
        if ((x2 === x && y2 === y) || x2 < 0 || y2 < 0 || x2 >= input[y].length || y2 >= input.length || (digitCoordinates.some(([x3, y3]) => x3 === x2 && y3 === y2))) {
          continue;
        }
        if (input[y2][x2] !== Empty) {
          empty = false;
        }
      }
    }
    return empty;
  }, true);

}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);
  var sum = 0n
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const digitCoordinates: [number, number][] = [];
      var digits = "";
      while (isNumber(input[y][x]) && x < input[y].length) {
        digitCoordinates.push([x, y]);
        digits += input[y][x];
        x++;
      }
      if ((digits !== "") && !isStandalone(input, digitCoordinates, digits)) {
        sum += BigInt(digits);
      }
    }
  }

  return sum;
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day03_test.txt", 4361n);
runAndCheck("inputs/day03.txt", 540212n);
