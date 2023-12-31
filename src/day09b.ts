import { assert } from "console";
import * as fsPromise from "fs/promises";

async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function parseInput(input: String): number[][] {
  return input.split("\n").map((line) => {
    return line.split(" ").map((char) => {
      return Number(char);
    });
  });
}

function predictSerie(serie: number[]): number {
  let currentSerie = serie
  const firstValues = [];
  while (!currentSerie.every((v) => v === 0)) {
    firstValues.push(currentSerie[0]);
    currentSerie = currentSerie.reduce((nextSeries, value, index) => {
      if (index + 1 < currentSerie.length) {
        nextSeries.push(currentSerie[index + 1] - value);
      }
      return nextSeries;
    }, []);
  }
  return firstValues.reverse().reduce((prev, value) => {
    return value - prev;
  }, 0);
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const series = parseInput(text);
  return series.reduce((sum, serie) => {
    return sum + BigInt(predictSerie(serie));
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


runAndCheck("inputs/day09_test.txt", 2n);
runAndCheck("inputs/day09.txt", 995n);
