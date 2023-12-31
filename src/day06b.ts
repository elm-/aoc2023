import { assert } from "console";
import * as fsPromise from "fs/promises";


type Race = {
  time: number;
  recordDistance: number;
}

async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function parseInput(input: string): Race {
  const [, timeStr, distanceStr] = /Time: +([\d ]+)\nDistance: +([\d ]+)/.exec(input);
  const times = Number(timeStr.replaceAll(" ", ""))
  const distances = Number(distanceStr.replaceAll(" ", ""))
  return {
    time: times,
    recordDistance: distances
  };
}

function simulateRaceRec(raceTime: number, pressTime: number): number[] {
  assert(pressTime >= 0, "Press time must be larger than 0");
  assert(pressTime <= raceTime, "press time must be smaller than race time");
  if (pressTime === 0) {
    return [0];
  } else {
    return simulateRaceRec(raceTime, pressTime - 1).concat([(raceTime - pressTime) * pressTime]);
  }
}

function simulateRaceQuadratic(race: Race): number {
  const upper = (race.time + Math.sqrt(Math.pow(race.time, 2) - 4 * race.recordDistance)) / 2;
  const lower = (race.time - Math.sqrt(Math.pow(race.time, 2) - 4 * race.recordDistance)) / 2;
  return Math.ceil(upper) - (Math.floor(lower) + 1);
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const race = parseInput(text);
  return BigInt(simulateRaceQuadratic(race));
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day06_test.txt", 71503n);
runAndCheck("inputs/day06.txt", 35349468n);
