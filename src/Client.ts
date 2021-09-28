#!/usr/bin/env -S deno run --allow-net --no-check

import { Game } from "./mod.ts";

const ws = new WebSocket("ws://localhost:3000");

const username = prompt("Please pick a username");

const lookForPlayer = confirm("Want to find a player?");

let game: Game;

ws.onopen = () => {
  if (lookForPlayer) {
    const user = prompt("Who are you looking for?");
    ws.send(JSON.stringify({
      op: 2,
      d: {
        against: user,
        name: username,
      },
    }));
  } else {
    ws.send(JSON.stringify({
      op: 2,
      d: {
        name: username,
      },
    }));
  }
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log(data);
  let res: string | null;
  switch (data.op) {
    case 2: {
      game = new Game();
      if (data.d.status !== "ready") return;
      res = prompt("Rock, paper or scissors:");
      ws.send(JSON.stringify({ op: 3, d: res }));
      break;
    }
    case 3: {
      console.log(res!);
      console.log(
        Game.compare(
          game.items.find((item) => item.name === res)!,
          game.items.find((item) => item.name === data.d)!,
        ),
      );
    }
  }
};
