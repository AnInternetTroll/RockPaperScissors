/// <reference lib="dom" />

import React, { useEffect, useState } from "https://esm.sh/react";
import { render } from "https://esm.sh/react-dom";

import { Game, Item } from "./mod.ts";

interface PlayerHuman {
  bot: false;
  username?: string;
  item?: Item;
  setItem: React.Dispatch<React.SetStateAction<Item | undefined>>;
  playerPos: 1 | 2;
}

interface PlayerBot {
  bot: true;
  item?: Item;
  playerPos: 1 | 2;
}

type Player = PlayerHuman | PlayerBot;

interface GameViewOpts {
  player1: Player;
  player2: Player;
  game: Game;
}

function PlayerView(
  { player, game }: { player: Player; game: Game } = {
    player: { bot: true, playerPos: 1 },
    game: new Game(),
  },
) {
  if (!player.bot) {
    return (
      <>
        {game.items.map((item, index) => (
          <>
            <img
              src={item.picture}
              onClick={() => player.setItem(item)}
              className={`item player${player.playerPos} playable`}
              style={{
                height: `${100 / (game.items.length + 2)}vh`,
                visibility: player.item
                  ? (player.item.name === item.name ? "visible" : "hidden")
                  : "visible",
                gridColumn: player.playerPos === 2 ? 3 : player.playerPos,
                gridRow: index + 1,
              }}
            />
            <br />
          </>
        ))}
      </>
    );
  } else {
    const [botItemPreviewRandomlyInterval, setBotItemPreviewRandomlyInterval] =
      useState<number>();

    const [botPreview, setBotPreview] = useState<Item>();

    useEffect(() => {
      if (!player.item && !botItemPreviewRandomlyInterval) {
        let index = game.items.length - 1;
        setBotItemPreviewRandomlyInterval(setInterval(() => {
          setBotPreview(game.items[index]);
          index = index === 0 ? (game.items.length - 1) : index - 1;
        }, 500));
      }
    }, [
      player.item,
      setBotItemPreviewRandomlyInterval,
      setBotPreview,
      game.items,
      setInterval,
      botItemPreviewRandomlyInterval,
    ]);

    useEffect(() => {
      if (player.item) {
        clearInterval(botItemPreviewRandomlyInterval);
        setBotPreview(player.item);
      }
    }, [
      player.item,
      clearInterval,
      botItemPreviewRandomlyInterval,
      setBotPreview,
    ]);

    return (
      <img
        src={botPreview?.picture}
        className={`item player${player.playerPos} playable`}
        style={{ height: `${100 / (game.items.length + 2)}vh` }}
      />
    );
  }
}

function GameView({ player1, player2, game }: GameViewOpts) {
  const [result, setResult] = useState("");

  const [timerPreview, setTimerPreview] = useState(3);
  const [timerPreviewInterval, setTimerPreviewInterval] = useState<number>();
""
  useEffect(
    () => {
      if (player1.item && player2.item) {
        if (!player1.bot && (timerPreview && timerPreview !== 1)) {
          setResult("Too early");
          clearInterval(timerPreviewInterval);
        } else if (!timerPreview) {
          return;
        } else {
          clearInterval(timerPreviewInterval);
          setResult(Game.compare(player1.item, player2.item));
        }
      }
    },
    [
      player1.item,
      player2.item,
      setResult,
      Game.compare,
      clearInterval,
      timerPreviewInterval,
    ],
  );

  useEffect(() => {
    let timerPreviewTemp = timerPreview;
    setTimerPreviewInterval(
      setInterval(() => {
        if (timerPreviewTemp !== -1) {
          setTimerPreview(timerPreviewTemp--);
        }
      }, 1000),
    );
    if (timerPreviewTemp === timerPreview) timerPreviewTemp--;
  }, [setTimerPreviewInterval, setInterval, setTimerPreview]);

  useEffect(() => {
    if (!timerPreview && timerPreviewInterval) {
      clearInterval(timerPreviewInterval);
      setResult("Too late");
    }
  }, [timerPreview, clearInterval, timerPreviewInterval]);

  return (
    <div className="gameview">
      <PlayerView player={player1} game={game} />
      <p className="result">{result}</p>
      <p
        className="timer"
        style={{
          color: timerPreview !== 1 ? "red" : "green",
        }}
      >
        {timerPreview}
      </p>
      <PlayerView player={player2} game={game} />
    </div>
  );
}

function Offline() {
  const game = new Game();

  const [userChoice, setUserChoice] = useState<Item>();
  const [botChoice, setBotChoice] = useState<Item>();

  useEffect(() => userChoice && setBotChoice(game.bot_attempt()), [
    userChoice,
    setUserChoice,
    game.bot_attempt,
  ]);

  return (
    <div className="offline">
      <GameView
        game={game}
        player1={{
          setItem: setUserChoice,
          bot: false,
          item: userChoice,
          playerPos: 1,
        }}
        player2={{ bot: true, item: botChoice, playerPos: 2 }}
      />
    </div>
  );
}

function SplitScreen() {
  const game = new Game();

  const [player1Choice, setPlayer1Choice] = useState<Item>();
  const [player2Choice, setPlayer2Choice] = useState<Item>();

  return (
    <div className="splitscreen">
      <GameView
        game={game}
        player1={{
          setItem: setPlayer1Choice,
          bot: false,
          item: player1Choice,
          playerPos: 1,
        }}
        player2={{
          bot: false,
          item: player2Choice,
          setItem: setPlayer2Choice,
          playerPos: 2,
        }}
      />
    </div>
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
      setStatus(e.data);
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

type Gamemodes = "offline" | "online" | "split" | null;

function Main() {
  const [gamemode, setGamemode] = useState<Gamemodes>(null);
  const [title, setTitle] = useState("Chose a gamemode");
  return (
    <>
      <h1>{title}</h1>
      <button
        onClick={() => {
          setGamemode("offline");
          setTitle("Vs. Bot");
        }}
      >
        Offline
      </button>
      <button
        onClick={() => {
          setGamemode("online");
          setTitle("Vs. Human");
        }}
      >
        Online
      </button>
      <button
        onClick={() => {
          setGamemode("split");
          setTitle("Split");
        }}
      >
        SplitScreen
      </button>
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
