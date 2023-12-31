import { assert, log } from "console";
import * as fsPromise from "fs/promises";


const validCardChars = new Set(["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"]);

type Card = "A" | "K" | "Q" | "J" | "T" | "9" | "8" | "7" | "6" | "5" | "4" | "3" | "2";
type Hand = [Card, Card, Card, Card, Card];
type Game = {
  hand: Hand,
  strongestHand: Hand,
  bid: number,
}


async function readTextFile(path: string): Promise<string> {
  const file = await fsPromise.open(path, "r");
  const text = file.readFile({ encoding: "utf-8" });
  await file.close();
  return text;
}

function parseInput(input: String): Game[] {
  return input.split("\n").map((line) => {
    const [handStr, bidStr] = line.split(" ");
    assert(handStr.split("").every((char) => validCardChars.has(char)), `Invalid card in hand ${handStr}`);
    const hand = handStr.split("") as Hand;
    return {
      hand: hand,
      strongestHand: findStrongestHand(hand),
      bid: Number(bidStr.trim()),
    }
  });
}


function getCardValue(card: Card): number {
  switch (card) {
    case "A":
      return 14;
    case "K":
      return 13;
    case "Q":
      return 12;
    case "J":
      return 1;
    case "T":
      return 10;
    default:
      return Number(card);
  }
}

function compare(card1: Card, card2: Card): number {
  return getCardValue(card1) - getCardValue(card2);
}

function getHandValue(hand: Hand): number {
  const counts = hand.reduce((counts, card) => {
    counts.set(card, (counts.get(card) ?? 0) + 1);
    return counts;
  }, new Map<Card, number>());
  const countMap = (fn: (k: string, v: number) => boolean) => {
    var count = 0;
    for (const [k, v] of counts) {
      if (fn(k, v)) {
        count += 1;
      }
    }
    return count;
  };
  if (countMap((_, v) => v === 5) === 1) {
    return 7;
  } else if (countMap((_, v) => v === 4) === 1) {
    return 6;
  } else if (countMap((_, v) => v === 3) === 1 && countMap((_, v) => v === 2) === 1) {
    return 5;
  } else if (countMap((_, v) => v === 3) === 1) {
    return 4;
  } else if (countMap((_, v) => v === 2) == 2) {
    return 3;
  } else if (countMap((_, v) => v === 2) == 1) {
    return 2;
  } else {
    return 1;
  }
}

function compareHands(hand1: Hand, hand2: Hand, origH1: Hand, origH2: Hand): number {
  const value1 = getHandValue(hand1);
  const value2 = getHandValue(hand2);
  if (value1 !== value2) {
    return value1 - value2;
  } else {
    for (let i = 0; i < 5; i++) {
      const card1 = origH1[i];
      const card2 = origH2[i];
      const cardCompare = compare(card1, card2);
      if (cardCompare !== 0) {
        return cardCompare;
      }
    }
  }
  return 0;
}

function findStrongestHand(hand: Hand): Hand {
  const generatePossibleHands = (hand: Hand, index: number): Hand[] => {
    if (index === 5) {
      return [hand];
    } else if (hand[index] === "J") {
      return Array.from(validCardChars.values()).reduce((hands, validCard) => {
        hands.push(...generatePossibleHands([...hand.slice(0, index), validCard, ...hand.slice(index + 1)] as Hand, index + 1));
        return hands;
      }, [] as Hand[]);
    } else {
      return generatePossibleHands(hand, index + 1);
    }
  };
  const allPossibleHands = generatePossibleHands(hand, 0);
  const rankedHands = allPossibleHands.sort((a, b) => compareHands(a, b, a, b));
  const strongestHand = rankedHands[rankedHands.length - 1];
  return strongestHand;
}

async function algorithm(path: string): Promise<bigint> {
  const text = await readTextFile(path);
  const games = parseInput(text);
  return games
  .sort((game1, game2) => compareHands(game1.strongestHand, game2.strongestHand, game1.hand, game2.hand))
  .reduce((sum, game, index) => {
      return sum + BigInt(game.bid * (index + 1));
    }, 0n)
}

async function runAndCheck(path: string, expected: bigint): Promise<void> {
  const result = await algorithm(path);

  if (result !== expected) {
    throw new Error(`Expected ${expected} but got ${result} for file ${path}`);
  } else {
    console.log(`Result for file ${path} is correct: ${result}`);
  }
}


runAndCheck("inputs/day07_test.txt", 5905n);
runAndCheck("inputs/day07.txt", 251195607n);
