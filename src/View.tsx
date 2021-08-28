/// <reference lib="dom" />

import React, { useEffect, useState } from "https://esm.sh/react";
import { render } from "https://esm.sh/react-dom";

import { Game, Item } from "./mod.ts";
import type { CompareReturn, Rules } from "./mod.ts";

interface PlayerHuman {
  bot: false;
  username?: string;
  item?: Item;
  setItem: React.Dispatch<React.SetStateAction<Item | undefined>>;
  playerPos: 1 | 2;
}

interface PlayerBot {
  username?: string;
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
      if (!player.item) setBotItemPreviewRandomlyInterval(undefined);
      setBotPreview(undefined);
    }, [setBotItemPreviewRandomlyInterval, setBotPreview, player.item]);
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
  const [results, setResults] = useState<boolean[]>([]);

  const [timerPreview, setTimerPreview] = useState(game.time);
  const [timerPreviewInterval, setTimerPreviewInterval] = useState<number>();

  function stopOrReset() {
    console.log(results);
    if (
      results.filter((res) => res).length >= game.triesLimit ||
      results.filter((res) => !res).length >= game.triesLimit
    ) {
      stop();
    } else reset();
  }

  function reset() {
    setTimerPreview(game.time);
    setTimerPreviewInterval(undefined);
    if (!player1.bot) player1.setItem(undefined);
    if (!player2.bot) player2.setItem(undefined);
  }

  function stop() {
    clearInterval(timerPreviewInterval);
    setTimerPreview(undefined);
    setResult("End game");
  }

  useEffect(() => stopOrReset(), [
    results,
  ]);

  if (game.time) {
    useEffect(
      () => {
        if (player1.item && player2.item) {
          if (!player1.bot && (timerPreview && timerPreview !== 1)) {
            setResult("Too early");
            clearInterval(timerPreviewInterval);
            setResults([...results, false]);
          } else if (!timerPreview) {
            return;
          } else {
            clearInterval(timerPreviewInterval);
            const res = Game.compare(player1.item, player2.item);
            setResult(res);
            if (res === "draw") return reset();
            setResults([...results, res === "win"]);
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
      if (!timerPreview || timerPreviewInterval) return;
      let timerPreviewTemp = timerPreview;
      setTimerPreviewInterval(
        setInterval(() => {
          if (timerPreviewTemp !== -1) {
            setTimerPreview(timerPreviewTemp--);
          }
        }, 1000),
      );
      if (timerPreviewTemp === timerPreview) timerPreviewTemp--;
    }, [setTimerPreviewInterval, setInterval, setTimerPreview, timerPreview]);

    useEffect(() => {
      if (!timerPreview && timerPreviewInterval) {
        clearInterval(timerPreviewInterval);
        setResult("Too late");
        setResults([...results, false]);
      }
    }, [timerPreview, clearInterval, timerPreviewInterval, setResult]);
  } else {
    useEffect(() => {
      if (player1.item && player2.item) {
        const res = Game.compare(player1.item, player2.item);
        if (res === "draw") return reset();
        setResult(res);
        setResults([...results, res === "win"]);
      }
    }, [player1.item, player2.item, setResult, Game.compare]);
  }
  return (
    <div className="gameview">
      <PlayerView player={player1} game={game} />
      {game.time
        ? (
          <p
            className="timer"
            style={{
              color: timerPreview !== 1 ? "red" : "green",
            }}
          >
            {timerPreview}
          </p>
        )
        : ""}
      <p className="result">{result}</p>
      <p className="results">{results.map((result) => (result ? "x" : "o"))}</p>
      <PlayerView player={player2} game={game} />
    </div>
  );
}

function Offline() {
  const game = new Game({ time: 3 });

  const [userChoice, setUserChoice] = useState<Item>();
  const [botChoice, setBotChoice] = useState<Item>();

  useEffect(() => {
    if (userChoice) setBotChoice(game.bot_attempt());
    else setBotChoice(undefined);
  }, [
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

  const [player1Item, setPlayer1Item] = useState<Item>();
  const [player2Item, setPlayer2Item] = useState<Item>();
  const [game, setGame] = useState<Game>();

  const [status, setStatus] = useState("");

  const [ws, setWs] = useState<WebSocket>();

  function connect() {
    if (!ws) return;
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
      console.log(e.data);
      switch (data.op) {
        case 2: {
          if (data.d.status === "ready") {
            setGame(
              new Game({
                items: (data.d.rules as Rules).items.map((item) =>
                  new Item(item.weakness, {
                    name: item.name,
                    picture: item.picture,
                  })
                ),
                tries: (data.d.rules as Rules).tries,
                time: null,
              }),
            );
            setPlayer1Item(undefined);
            setPlayer2Item(undefined);
          }
          break;
        }
        case 3: {
          setPlayer2Item(game?.items.find((item) => item.name === data.d));
          break;
        }
      }
    };
  }
  useEffect(() => connect(), [ws, connect]);
  useEffect(
    () =>
      (ws && player1Item) &&
      ws.send(JSON.stringify({ op: 3, d: player1Item.name })),
    [ws, player1Item, JSON.stringify],
  );
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
      <button onClick={() => setWs(new WebSocket(`ws://${location.host}`))}>
        Connect
      </button>
      {game
        ? (
          <GameView
            player1={{
              username,
              bot: false,
              playerPos: 1,
              setItem: setPlayer1Item,
              item: player1Item,
            }}
            player2={{
              username,
              bot: true,
              playerPos: 2,
              item: player2Item,
            }}
            game={game}
          />
        )
        : ""}
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
