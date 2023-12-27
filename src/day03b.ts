import { assert } from "console";
import * as fsPromise from "fs/promises";

const Empty = ".";
const Gear = "*";
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

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);
  var sum = 0n
  const [digitLocations, digitLocationsNumbers] = extractNumbers(input);
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === Gear) {
        const neighborLocations = digitLocations.reduce((neighbors, digitCoordinates, index) => {
          const isNeighbor = digitCoordinates.some(([x2, y2]) => {
            return Math.abs(x2 - x) <= 1 && Math.abs(y2 - y) <= 1;
          });
          if (isNeighbor) {
            neighbors.push(digitLocationsNumbers[index]);
          }
          return neighbors;
        }, [] as string[]);
        if (neighborLocations.length === 2) {
          sum += BigInt(neighborLocations[0]) * BigInt(neighborLocations[1]);
        }
      }
    }
  }

  return sum;
}

function extractNumbers(input: string[][]): [[number, number][][], string[]] {
  const digitLocations: [number, number][][] = [];
  const digitLocationsNumbers: string[] = [];
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const digitCoordinates: [number, number][] = [];
      var digits = "";
      while (isNumber(input[y][x]) && x < input[y].length) {
        digitCoordinates.push([x, y]);
        digits += input[y][x];
        x++;
      }
      if (digits !== "") {
        digitLocations.push(digitCoordinates);
        digitLocationsNumbers.push(digits);
      }
    }
  }
  return [digitLocations, digitLocationsNumbers];
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day03_test.txt", 467835n);
runAndCheck("inputs/day03.txt", 87605697n);
