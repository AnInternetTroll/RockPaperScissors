#!/usr/bin/env -S deno run --no-check --allow-read
import { Item } from "./mod.ts";

export interface GameOpts {
  tries?: number;
  items?: Item[];
  time?: number | null;
}

export type CompareReturn = "draw" | "win" | "lose";

export interface Rules {
  tries: number;
  items: {
    name: string;
    weakness: string[];
    picture: string;
  }[];
}

export class Game {
  tries: number;
  triesLimit: number;
  items: Item[];
  time?: number | null;

  constructor(
    {
      tries = 3,
      time = 3,
      items = [
        new Item(["paper"], {
          name: "rock",
          picture: "./assets/rock.svg",
        }),
        new Item(["scissors"], {
          name: "paper",
          picture: "./assets/paper.svg",
        }),
        new Item(["rock"], {
          name: "scissors",
          picture: "./assets/scissors.svg",
        }),
      ],
    }: GameOpts = {},
  ) {
    this.tries = tries;
    this.triesLimit = Math.floor(tries / 2) + 1;
    this.time = time;
    this.items = items;
  }

  /**
   * A helper function to get the rules of a game.
   * Used in multiplayer to tell all clients the items and how many tries in total.
   */
  get rules(): Rules {
    return {
      tries: this.tries,
      items: this.items.map((item) => ({
        name: item.name,
        weakness: item.weakness,
        picture: item.picture,
      })),
    };
  }

  /**
   * Compares 2 items from the perspective of the first.
   * So if the first item beats the second then it returns "win"
   * else it returns "lose"
   * else it returns "draw"
   * @param item1 First item
   * @param item2 Second Items
   */
  static compare(item1: Item, item2: Item): CompareReturn {
    for (let i = 0; i < item1.weakness.length; i++) {
      for (let ii = 0; ii < item2.weakness.length; ii++) {
        if (item1.weakness[i] === item2.weakness[ii]) return "draw";
        else if (item2.weakness[i] === item1.name) return "win";
        else if (item1.weakness[i] === item2.name) return "lose";
        else return "draw";
      }
    }
    return "draw";
  }

  /**
   * A helper function that returns a random item from the game.
   * @returns Bot choice
   */
  bot_attempt(): Item {
    return this.items[Math.round(Math.random() * (this.items.length - 1))];
  }
}

class Offline extends Game {
  offline_round(): CompareReturn {
    const res = prompt(
      `Pick one of: ${
        this.items.map((item) => item.name.trim().toLowerCase()).join(", ")
      }:`,
    );
    const item1 = this.items.find((item) =>
      item.name.trim().toLowerCase() === res
    );
    if (!item1) throw new Error(`${res} not found. Please try again`);
    const item2 = this.bot_attempt();
    return Game.compare(item1, item2);
  }

  offline() {
    let triesLeft = this.tries;
    const results: boolean[] = [];
    for (let i = 0; i < triesLeft; i++) {
      if (
        results.filter((res) => res).length >= this.triesLimit ||
        results.filter((res) => !res).length >= this.triesLimit
      ) {
        break;
      }
      const result = this.offline_round();
      switch (result) {
        case "draw": {
          console.log("Draw, try again");
          triesLeft++;
          continue;
        }
        case "lose": {
          console.log("You lost this round.");
          results.push(false);
          continue;
        }
        case "win": {
          console.log("You won this round.");
          results.push(true);
          continue;
        }
      }
    }
    console.log(results);
  }
}

if (import.meta.main) {
  const game = new Offline();
  game.offline();
}
