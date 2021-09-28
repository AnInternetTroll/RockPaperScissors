/// <reference lib="dom" />

/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, render } from "https://esm.sh/preact";
import { useState } from "https://esm.sh/preact/hooks";
import { Offline } from "./components/Offline.tsx";
import { Online } from "./components/Online.tsx";
import { SplitScreen } from "./components/SplitScreen.tsx";

type Gamemodes = "offline" | "online" | "split" | null;

function Main() {
  const [gamemode, setGamemode] = useState<Gamemodes>(null);
  const [title, setTitle] = useState("Chose a gamemode");
  return (
    <>
      <h1>{title}</h1>
      <div class="btn-group">
        <button
          onClick={() => {
            setGamemode("offline");
            setTitle("Vs. Bot");
          }}
          class={gamemode === "offline" ? "active" : ""}
        >
          Offline
        </button>
        <button
          onClick={() => {
            setGamemode("online");
            setTitle("Vs. Human");
          }}
          class={gamemode === "online" ? "active" : ""}
        >
          Online
        </button>
        <button
          onClick={() => {
            setGamemode("split");
            setTitle("Split");
          }}
          class={gamemode === "split" ? "active" : ""}
        >
          SplitScreen
        </button>
      </div>
      <hr />
      {gamemode === "offline" ? <Offline /> : gamemode === "online"
        ? <Online />
        : gamemode === "split"
        ? <SplitScreen />
        : (
          <>
            <p>
              Welcome to Rock, Paper, Scissors
            </p>
          </>
        )}
    </>
  );
}

const bodyEl = document.querySelector("body");

if (bodyEl) render(<Main />, bodyEl);
