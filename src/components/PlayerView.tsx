/// <reference lib="dom" />
/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { Fragment, h, useEffect, useState } from "../deps_frontend.ts";
import type { StateUpdater } from "../deps_frontend.ts";
import { Game, Item } from "../mod.ts";

interface PlayerHuman {
  bot: false;
  username?: string;
  item?: Item;
  setItem: StateUpdater<Item | undefined>;
  playerPos: 1 | 2;
}

interface PlayerBot {
  bot: true;
  username?: string;
  item?: Item;
  playerPos: 1 | 2;
}

export type Player = PlayerHuman | PlayerBot;

export function PlayerView(
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
              class={`item player${player.playerPos} playable`}
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
        class={`item player${player.playerPos}`}
        style={{ height: `${100 / (game.items.length + 2)}vh` }}
      />
    );
  }
}
