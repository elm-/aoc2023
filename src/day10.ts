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

function findStart(field: string[][]): [number, number] {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      if (field[y][x] === "S") {
        return [x, y];
      }
    }
  }
  throw new Error("No start found");
}


function walk(field: string[][], x: number, y: number, fromX: number, fromY: number): number {
  const handleError = () => {
    if (field[fromY][fromX] === "S") { // start, can be invalid move, just ignore
      return 0;
    } else {
      throw new Error(`invalid move from ${fromX},${fromY} to ${x},${y} field ${field[y][x]} fromField ${field[fromY][fromX]}`)
    }
  }
  if (x < 0 || y < 0 || y >= field.length || x >= field[y].length) {
    return 0;
  } else if (field[y][x] === "S") {
    return 0;
  } else if (field[y][x] === "|") {
    if (fromX === x && fromY === y - 1) {
      return walk(field, x, y + 1, x, y) + 1;
    } else if (fromX === x && fromY === y + 1) {
      return walk(field, x, y - 1, x, y) + 1;
    } else {
      return handleError();
    }
  } else if (field[y][x] === "-") {
    if (fromX === x - 1 && fromY === y) {
      return walk(field, x + 1, y, x, y) + 1;
    } else if (fromX === x + 1 && fromY === y) {
      return walk(field, x - 1, y, x, y) + 1;
    } else {
      return handleError()
    }
  } else if (field[y][x] === "L") {
    if (fromX === x && fromY === y - 1) {
      return walk(field, x + 1, y, x, y) + 1;
    } else if (fromX === x + 1 && fromY === y) {
      return walk(field, x, y - 1, x, y) + 1;
    } else {
      return handleError()
    }
  } else if (field[y][x] === "J") {
    if (fromX === x && fromY === y - 1) {
      return walk(field, x - 1, y, x, y) + 1;
    } else if (fromX === x - 1 && fromY === y) {
      return walk(field, x, y - 1, x, y) + 1;
    } else {
      return handleError()
    }
  } else if (field[y][x] === "7") {
    if (fromX === x && fromY === y + 1) {
      return walk(field, x - 1, y, x, y) + 1;
    } else if (fromX === x - 1 && fromY === y) {
      return walk(field, x, y + 1, x, y) + 1;
    } else {
      return handleError()
    }
  } else if (field[y][x] === "F") {
    if (fromX === x && fromY === y + 1) {
      return walk(field, x + 1, y, x, y) + 1;
    } else if (fromX === x + 1 && fromY === y) {
      return walk(field, x, y + 1, x, y) + 1;
    } else {
      return handleError()
    }
  } else if (field[y][x] === ".") {
    return 0;
  } else {
    throw new Error(`invalid field ${x},${y} field ${field[y][x]}`)
  }
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const field = parseInput(text);
  const [startX, startY] = findStart(field);
  const maxDistance = Math.max(
    walk(field, startX + 1, startY, startX, startY),
    walk(field, startX - 1, startY, startX, startY),
    walk(field, startX, startY + 1, startX, startY),
    walk(field, startX, startY - 1, startX, startY));
  return BigInt(Math.ceil(maxDistance / 2))
}



async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day10_test.txt", 8n);
runAndCheck("inputs/day10.txt", 6979n);
