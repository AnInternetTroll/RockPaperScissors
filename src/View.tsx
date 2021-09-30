/// <reference lib="dom" />
/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, render, useEffect, useState } from "./deps_frontend.ts";
import { Offline, Online, SplitScreen } from "./components/mod.ts";

type Gamemodes = "offline" | "online" | "split" | null;

function Main() {
  const [gamemode, setGamemode] = useState<Gamemodes>(null);
  const [title, setTitle] = useState("Chose a gamemode");
  const [onlineAvailable, setOnlineAvailable] = useState(false);
  useEffect(() => {
    try {
      const ws = new WebSocket(`ws://${location.host}`);
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.op === 1 && data.d === "ping") setOnlineAvailable(true);
        ws.close();
      };
      ws.onopen = () => ws.send(JSON.stringify({ op: 1, d: "ping" }));
    } catch (err) {
      setOnlineAvailable(false);
    }
  }, [setOnlineAvailable]);
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
        {onlineAvailable
          ? (
            <button
              onClick={() => {
                setGamemode("online");
                setTitle("Vs. Human");
              }}
              class={gamemode === "online" ? "active" : ""}
            >
              Online
            </button>
          )
          : ""}
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
