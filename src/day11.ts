import { assert } from 'console';
import * as fsPromise from 'fs/promises';

const Empty = ".";
const Galaxy = "#";


async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, 'r');
  return file.readFile({ encoding: 'utf-8' });
}

function parseInput(input: String): string[][] {
  return input.split("\n").map((line) => {
    return line.split("").map((char) => {
      return char;
    });
  });
}

function findEmpty(field: string[][]): [number[], number[]] {
  const isLaneEmpty = (x: number, y: number, xd: number, yd: number): boolean => {
    var isEmpty = true;
    for (let ix = x, iy = y; ix < field.length && iy < field.length; ix += xd, iy += yd) {
      isEmpty = isEmpty && (field[iy][ix] === Empty);
    }
    return isEmpty;
  }
  const hEmpty: number[] = [];
  const vEmpty: number[] = [];
  for (let i = 0; i < field.length; i++) {
    if (isLaneEmpty(0, i, 1, 0)) { hEmpty.push(i); }
    if (isLaneEmpty(i, 0, 0, 1)) { vEmpty.push(i); }
  }
  return [hEmpty, vEmpty];
}

function numberField(field: string[][]): [string[][], Map<number, [number, number]>] {
  let count = 0;
  const galaxyMap = new Map<number, [number, number]>();
  return [field.map((line, y) => {
    return line.map((char, x) => {
      if (char === Galaxy) {
        galaxyMap.set(count, [x, y]);
        count++;
        return (count - 1).toString();
      }
      return char;
    });
  }), galaxyMap];
}

function generateUniqueTuples(count: number): Array<[number, number]> {
  // why Set doesn't work with tuples of arrays due to identity, is there a proper way to do this?
  const tuples = new Array<[number, number]>();
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      const tuple = sortTuple([i, j]);
      if ((i !== j) && !tuples.find((t) => t[0] === tuple[0] && t[1] === tuple[1])) {
        tuples.push(tuple);
      }
    }
  }
  return tuples;
}

function sortTuple(tuple: [number, number]): [number, number] {
  return tuple.sort((a, b) => a - b);
}

function printField(field: string[][]): void {
  field.forEach((line) => {
    console.log(line.join(""));
  });
}

async function algorithm(path: string, emptyFactor: number): Promise<bigint> {
  const text = await readTextFile(path);
  const input = parseInput(text);
  const [hEmpty, vEmpty] = findEmpty(input);
  const [numberedField, galaxyMap] = numberField(input);
  const tuples = generateUniqueTuples(galaxyMap.size);
  return tuples.reduce((sum, [g1, g2]) => {
    const [g1x, g1y] = galaxyMap.get(g1);
    const [g2x, g2y] = galaxyMap.get(g2);
    const [x1, x2] = sortTuple([g1x, g2x])
    const [y1, y2] = sortTuple([g1y, g2y]);
    assert(x1 <= x2, `x1: ${x1} x2: ${x2}`)
    assert(y1 <= y2, `y1: ${y1} y2: ${y2}`)
    const vEmptyCount = vEmpty.filter((x) => x >= x1 && x <= x2).length
    const hEmptyCount = hEmpty.filter((y) => y >= y1 && y <= y2).length
    return sum + BigInt(Math.abs(g1x - g2x) + Math.abs(g1y - g2y) + (vEmptyCount + hEmptyCount) * (emptyFactor - 1));
  }, 0n);
}

async function runAndCheck(path: string, expected: bigint, emptyFactor: number): Promise<void> {
  const result = await algorithm(path, emptyFactor);
  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day11_test.txt", 374n, 2);
runAndCheck("inputs/day11_test.txt", 1030n, 10);
runAndCheck("inputs/day11_test.txt", 8410n, 100);

runAndCheck("inputs/day11.txt", 10276166n, 2);
runAndCheck("inputs/day11.txt", 598693078798n, 1000000);
