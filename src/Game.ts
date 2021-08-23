#!/usr/bin/env -S deno run --no-check
import Item from "./Item.ts";

export interface GameOpts {
  tries?: number;
  items?: Item[];
}
type CompareReturn = "draw" | "win" | "lose";

export default class Game {
  tries: number;
  items: Item[];

  constructor(
    {
      tries = 3,
      items = [
        new Item(["paper"], { name: "rock" }),
        new Item(["scissors"], { name: "paper" }),
        new Item(["rock"], { name: "scissors" }),
      ],
    }: GameOpts = {},
  ) {
    this.tries = tries;
    this.items = items;
  }

  /**
     * If the first
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
  bot_attempt(): Item {
    return this.items[Math.round(Math.random() * (this.items.length - 1))];
  }
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
  /*
    const rock = new Item(["paper"], { name: "rock" });
  const paper = new Item(["scissors"], { name: "paper" });
  const scissors = new Item(["rock"], { name: "scissors" });

  console.log(Game.compare(paper, paper));
  console.log(Game.compare(paper, rock));
  console.log(Game.compare(rock, scissors));
  console.log(Game.compare(scissors, rock));
  */
  const game = new Game();
  game.offline();
}
