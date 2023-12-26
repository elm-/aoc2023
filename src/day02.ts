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

const MaxColors: Round = { red: 12, green: 13, blue: 14 };

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);
  return input.reduce((sum, game) => {
    const validGame = game.rounds.reduce((valid, round) => {
      return valid && (round.blue <= MaxColors.blue && round.green <= MaxColors.green && round.red <= MaxColors.red)
    }, true);
    return sum + (validGame ? BigInt(game.id) : 0n);
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


runAndCheck("inputs/day02_test.txt", 8n);

runAndCheck("inputs/day02.txt", 2563n);
