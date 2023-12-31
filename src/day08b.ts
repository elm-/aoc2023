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

const lcm = (...arr) => {
  const gcd = (x, y) => (!y ? x : gcd(y, x % y));
  const _lcm = (x, y) => (x * y) / gcd(x, y);
  return [...arr].reduce((a, b) => _lcm(a, b));
};

function determineCycleLength(instructions: Instruction, network: Network, startNode: string): number {
  let currentNode = startNode;
  let currentInstruction = 0;
  while (! currentNode.endsWith("Z")) {
    const direction = instructions[currentInstruction % instructions.length];
    const node = network.get(currentNode);
    currentNode = direction === Direction.Left ? node.left : node.right;
    currentInstruction++;
  }
  return currentInstruction;
}


async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const [instructions, network] = parseInput(text);
  const cycleLengths = Array.from(network.keys())
    .filter((key) => key.endsWith("A"))
    .map((key) => determineCycleLength(instructions, network, key))
  return BigInt(lcm(...cycleLengths));
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day08b_test.txt", 6n);
runAndCheck("inputs/day08.txt", 13385272668829n);
