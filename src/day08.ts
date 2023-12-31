import { assert } from "console";
import * as fsPromise from "fs/promises";

enum Direction {
  Left,
  Right,
};

type Instruction = Direction[];

type Node = {
  id: string,
  left: string,
  right: string
};

type Network = Map<string, Node>;


async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function parseInput(input: string): [Instruction, Network] {
  const [rlStr, nodesStr] = input.split("\n\n");
  const instructions = rlStr.split("").map((char) => {
    return char === "L" ? Direction.Left : Direction.Right;
  });
  const nodes = nodesStr.split("\n").reduce((map, line) => {
    const [, id, left, right] = (/(\w+) = \((\w+), (\w+)\)/).exec(line);
    return map.set(id, { id, left, right });
  }, new Map<string, Node>());
  return [instructions, nodes]
}

function walkNetwork(instructions: Instruction, network: Network): bigint {
  let currentNode = "AAA";
  let currentInstruction = 0;
  while (currentNode !== "ZZZ") {
    const node = network.get(currentNode);
    const direction = instructions[currentInstruction % instructions.length];
    currentNode = direction === Direction.Left ? node.left : node.right;
    currentInstruction++;
  }
  return BigInt(currentInstruction);
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const [instructions, network] = parseInput(text);
  return walkNetwork(instructions, network);
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day08_test.txt", 6n);
runAndCheck("inputs/day08.txt", 12083n);
