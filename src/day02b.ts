import { assert } from "console";
import * as fsPromise from "fs/promises";

type Round = {
  red: number;
  green: number;
  blue: number;
};

type Game = {
  id: number;
  rounds: Round[];
};


async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  return file.readFile({ encoding: "utf-8" });
}


function parseInput(input: String): Game[] {
  return input.split("\n").map((line) => {
    const [, id, roundsStr] = /^Game (\d+): (.*)$/.exec(line);
    return {
      id: Number(id),
      rounds: roundsStr.split(/; /).map((roundStr) => {
        return roundStr.split(/, +/).reduce((round, colorStr) => {
          const [count, color] = colorStr.split(" ");
          if (color === "red") {
            return { ...round, red: Number(count) };
          } else if (color === "green") {
            return { ...round, green: Number(count) };
          } else if (color === "blue") {
            return { ...round, blue: Number(count) };
          } else {
            throw new Error(`Unknown color ${color} on line ${line}`)
          }
        }, { red: 0, green: 0, blue: 0 });
      })
    };
  });
}

function max(round1: Round, round2: Round): Round {
  return {
    red: Math.max(round1.red, round2.red),
    green: Math.max(round1.green, round2.green),
    blue: Math.max(round1.blue, round2.blue)
  };
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);
  return input.reduce((sum, game) => {
    const minRound = game.rounds.reduce((minRound, round) => {
      return max(minRound, round);
    }, { red: 0, green: 0, blue: 0 });
    assert(minRound.red !== 0 && minRound.green !== 0 && minRound.blue !== 0);
    return sum + BigInt(minRound.red * minRound.green * minRound.blue);
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


runAndCheck("inputs/day02_test.txt", 2286n);

runAndCheck("inputs/day02.txt", 70768n);
