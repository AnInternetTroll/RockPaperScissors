/**
 * @jsx h
 * @jsxFrag Fragment
 */
import { createRef, Fragment, h } from "https://esm.sh/preact";
import { useEffect, useState } from "https://esm.sh/preact/hooks";
import { Game } from "../mod.ts";
import { PlayerView } from "./PlayerView.tsx";
import type { Player } from "./PlayerView.tsx";

export interface GameViewOpts {
  player1: Player;
  player2: Player;
  game: Game;
}

export function GameView({ player1, player2, game }: GameViewOpts) {
  const [result, setResult] = useState("");
  const [results, setResults] = useState<boolean[]>([]);
  const failSoundRef = createRef<HTMLAudioElement>();

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
    clearInterval(timerPreviewInterval);
    setTimerPreviewInterval(undefined);
    if (!player1.bot) player1.setItem(undefined);
    if (!player2.bot) player2.setItem(undefined);
  }

  function stop() {
    clearInterval(timerPreviewInterval);
    setTimerPreview(undefined);
    setResult("End game");
  }

  function restart() {
    setResult("");
    setResults([]);
    reset();
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
            failSoundRef.current?.play();
            clearInterval(timerPreviewInterval);
            setResults([...results, false]);
          } else if (!timerPreview) {
            return;
          } else {
            clearInterval(timerPreviewInterval);
            const res = Game.compare(player1.item, player2.item);
            setResult(res);
            if (res === "draw") return reset();
            if (res === "lose") failSoundRef.current?.play();
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
        failSoundRef.current?.play();
        setResults([...results, false]);
      }
    }, [timerPreview, clearInterval, timerPreviewInterval, setResult]);
  } else {
    useEffect(() => {
      if (player1.item && player2.item) {
        const res = Game.compare(player1.item, player2.item);
        if (res === "draw") return reset();
        setResult(res);
        if (res === "lose") failSoundRef.current?.play();
        setResults([...results, res === "win"]);
      }
    }, [player1.item, player2.item, setResult, Game.compare]);
  }
  return (
    <>
      <button onClick={restart}>Restart</button>
      <audio ref={failSoundRef}>
        <source src="/assets/fail.mp3" type="audio/mp3"></source>
      </audio>
      <div class="gameview">
        <PlayerView player={player1} game={game} />
        {game.time
          ? (
            <p
              class="timer"
              style={{
                color: timerPreview !== 1 ? "red" : "green",
              }}
            >
              {timerPreview}
            </p>
          )
          : ""}
        <p class="result">{result}</p>
        <p class="results">
          {results.map((result) => (result ? "x" : "o"))}
        </p>
        <PlayerView player={player2} game={game} />
      </div>
    </>
  );
}
