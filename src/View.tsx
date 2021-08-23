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
      <select name="item" style={{ padding: "5px" }}>
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

function Main() {
  const [gamemode, setGamemode] = useState("");

  return <p>Hello, world</p>;
}

const bodyEl = document.querySelector("body");

if (bodyEl) reactDom.render(<Main />, bodyEl);
