/// <reference lib="dom" />
/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { h, useEffect, useState } from "../deps_frontend.ts";
import { Game, Item } from "../mod.ts";
import { GameView } from "./mod.ts";

export function Offline() {
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
    <div class="offline">
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
