/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { h } from "https://esm.sh/preact";
import { useState } from "https://esm.sh/preact/hooks";
import { Game, Item } from "../mod.ts";
import { GameView } from "./GameView.tsx";

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
