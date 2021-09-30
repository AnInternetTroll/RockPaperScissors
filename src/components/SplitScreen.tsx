/// <reference lib="dom" />
/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { h, useState } from "../deps_frontend.ts";
import { Game, Item } from "../mod.ts";
import { GameView } from "./mod.ts";

export function SplitScreen() {
  const game = new Game();

  const [player1Choice, setPlayer1Choice] = useState<Item>();
  const [player2Choice, setPlayer2Choice] = useState<Item>();

  return (
    <div class="splitscreen">
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
