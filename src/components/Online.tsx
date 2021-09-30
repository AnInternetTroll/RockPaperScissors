/// <reference lib="dom" />
/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, useEffect, useState } from "../deps_frontend.ts";
import { Game, Item } from "./../mod.ts";
import type { Rules } from "./../mod.ts";
import { GameView } from "./mod.ts";

export function Online() {
  const [lookForPlayer, setLookForPlayer] = useState(false);
  const [against, setAgainst] = useState("");
  const [username, setUsername] = useState("");

  const [player1Item, setPlayer1Item] = useState<Item>();
  const [player2Item, setPlayer2Item] = useState<Item>();
  const [game, setGame] = useState<Game>();

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
        placeholder="Steve"
        required
        onChange={(e) =>
          /* @ts-ignore preact type is wrong */
          setUsername(e.target.value)}
      />{" "}
      <label>Want to join a friend?</label>
      <label class="switch">
        <input
          type="checkbox"
          onChange={(e) =>
            /* @ts-ignore preact type is wrong */
            setLookForPlayer(e.target.checked)}
        />
        <span class="slider round"></span>
      </label>
      {lookForPlayer
        ? (
          <>
            <label>Who are you looking for?</label>
            <input
              type="text"
              placeholder="Alex"
              onChange={(e) =>
                /* @ts-ignore preact type is wrong */
                setAgainst(e.target.value)}
            />
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
    </>
  );
}
