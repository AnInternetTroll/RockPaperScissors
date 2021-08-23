#!/usr/bin/env -S deno run --allow-net --no-check
const ws = new WebSocket("ws://localhost:3000");

const username = prompt("Please pick a username");

const lookForPlayer = confirm("Want to find a player?");
ws.onopen = (e) => {
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
  switch (data.op) {
    case 2: {
      console.log("Joined!");
      const res = prompt("Rock, paper or scissors:");
      ws.send(JSON.stringify({ op: 3, d: res }));
      break;
    }
  }
};
