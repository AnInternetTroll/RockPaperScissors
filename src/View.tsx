/// <reference lib="dom" />

import React, { FormEvent, useState } from "https://esm.sh/react";
import reactDom from "https://esm.sh/react-dom";

import { Game } from "./mod.ts";

function Offline() {
  const game = new Game();

  const [result, setResult] = useState("");

  const formOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData = Object.fromEntries(
      // @ts-ignore trust me bro
      new FormData(e.target),
    );
    const user = game.items.find((item) => item.name === formData.item);
    const bot = game.bot_attempt();

    setResult(Game.compare(user!, bot));
  };

  return (
    <form onSubmit={formOnSubmit}>
      <label>Chose your weapon</label>
      <select name="item">
        {game.items.map((item) => (
          <option value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
      <button type="submit">Try</button>
      <p>{result}</p>
    </form>
  );
}

function Online() {
  const [lookForPlayer, setLookForPlayer] = useState(false);
  const [against, setAgainst] = useState("");
  const [username, setUsername] = useState("");

  const [status, setStatus] = useState("");
  function connect() {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = (e) => {
      if (lookForPlayer) {
        ws.send(JSON.stringify({
          op: 2,
          d: {
            against,
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
      setStatus(e.data)
      switch (data.op) {
        case 2: {
          console.log("Joined!");
          const res = prompt("Rock, paper or scissors:");
          ws.send(JSON.stringify({ op: 3, d: res }));
          break;
        }
      }
    };
  }
  return (
    <>
      <label>What's your username?</label>
      <input
        type="text"
        name="username"
        required
        onChange={(e) => setUsername(e.target.value)}
      />{" "}
      <br />
      <label>Want to join a friend?</label>
      <input
        type="checkbox"
        onChange={(e) => setLookForPlayer(e.target.checked)}
      />
      <br />
      {lookForPlayer
        ? (
          <>
            <label>Who are you looking for?</label>
            <input onChange={(e) => setAgainst(e.target.value)} />
          </>
        )
        : ""}
      <button onClick={connect}>Connect</button>
      <p>{status}</p>
    </>
  );
}

type Gamemodes = "offline" | "online";

function Main() {
  const [gamemode, setGamemode] = useState<Gamemodes>("offline");
  return (
    <>
      <h1>Chose a gamemode</h1>
      <button onClick={() => setGamemode("offline")}>Offline</button>
      <button onClick={() => setGamemode("online")}>Online</button>
      <hr />
      {gamemode === "offline" ? <Offline /> : <Online />}
    </>
  );
}

const bodyEl = document.querySelector("body");

if (bodyEl) reactDom.render(<Main />, bodyEl);
