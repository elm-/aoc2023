import { assert } from "console";
import * as fsPromise from "fs/promises";

type Card = {
  id: number;
  winning: number[];
  drawn: number[];
};

async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function strToCard(str: string): number[] {
  return str.trim().split(/ +/).map((str) => Number(str));
}

function parseInput(input: String): Card[] {
  return input.split("\n").map((line) => {
    const [, id, winningStr, drawnStr] = /^Card +(\d+): (.*)\|(.*)$/.exec(line);
    return {
      id: Number(id),
      winning: strToCard(winningStr),
      drawn: strToCard(drawnStr),
    };
  });
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);
  return input.reduce((sum, card) => {
    const winningNumbers = card.winning.filter((w) => card.drawn.includes(w)).length;
    return (winningNumbers === 0) ? sum : sum + (2n ** BigInt(winningNumbers - 1));
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


runAndCheck("inputs/day04_test.txt", 13n);
runAndCheck("inputs/day04.txt", 21568n);
