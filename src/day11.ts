import * as fsPromise from 'fs/promises';

const Empty = ".";
const Galaxy = "#";

function parseInput(input: String): Array<Array<String>> {
  return input.split("\n").map((line) => {
    return line.split("").map((char) => {
      return char;
    });
  });
}

function expandField(field: Array<Array<String>>): Array<Array<String>> {
  const expandedField = field.reduce((acc, cur) => {
    acc.push(cur);
    if (!cur.find((char) => char === Galaxy)) {
      acc.push(Object.assign([], cur))
    }
    return acc;
  }, new Array<Array<String>>());
  for (let x = field[0].length - 1; x > 0; x--) {
    const isEmptyColumn = (x: number): boolean => {
      let isEmpty = true;
      for (let y = 0; y < field.length; y++) {
        isEmpty = isEmpty && (field[y][x] === Empty);
      }
      return isEmpty;
    }
    if (isEmptyColumn(x)) {
      expandedField.forEach((line) => {
        line.splice(x, 0, Empty);
      });
    }
  }
  return expandedField;

}

function numberField(field: Array<Array<String>>): [Array<Array<String>>, Map<number, [number, number]>] {
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
      const tuple = [i, j].sort() as [number, number]
      if ((i !== j) && !tuples.find((t) => t[0] === tuple[0] && t[1] === tuple[1])) {
        tuples.push(tuple);
      }
    }
  }
  return tuples;
}

function printField(field: Array<Array<String>>): void {
  field.forEach((line) => {
    console.log(line.join(""));
  });
}

function algorithm(input: String): number {
  const field = parseInput(input);
  const expandedField = expandField(field);
  const [numberedField, galaxyMap] = numberField(expandedField);
  const tuples = generateUniqueTuples(galaxyMap.size);
  return tuples.reduce((sum, [g1, g2]) => {
    const [g1x, g1y] = galaxyMap.get(g1);
    const [g2x, g2y] = galaxyMap.get(g2);
    return sum + Math.abs(g1x - g2x) + Math.abs(g1y - g2y);
  }, 0);
}


fsPromise.open('./src/day11.txt', 'r')
  .then((file) => {
    return file.readFile({ encoding: 'utf-8' });
  })
  .then((input) => {
    const result = algorithm(input);
    console.log(`Test 1: ${result}`);
  })
  .catch((err) => {
    console.log(err);
  });

