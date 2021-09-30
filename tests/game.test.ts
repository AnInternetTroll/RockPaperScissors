import { Game, Item } from "../src/mod.ts";
import { assert } from "./deps_testing.ts";

const items = {
  rock: new Item(["paper"], { name: "rock", picture: "undefined" }),
  paper: new Item(["scissors"], { name: "paper", picture: "undefined" }),
  scissors: new Item(["rock"], { name: "scissors", picture: "undefined" }),
};

Deno.test("Rock vs Paper", () =>
  assert(Game.compare(items.rock, items.paper) === "lose"));

Deno.test("Rock vs Scissors", () =>
  assert(Game.compare(items.rock, items.scissors) === "win"));

Deno.test("Rock vs Rock", () =>
  assert(Game.compare(items.rock, items.rock) === "draw"));

Deno.test("Paper vs Paper", () =>
  assert(Game.compare(items.paper, items.paper) === "draw"));

Deno.test("Paper vs Scissors", () =>
  assert(Game.compare(items.paper, items.scissors) === "lose"));

Deno.test("Paper vs Rock", () =>
  assert(Game.compare(items.paper, items.rock) === "win"));

Deno.test("Scissors vs Scissors", () =>
  assert(Game.compare(items.scissors, items.scissors) === "draw"));

Deno.test("Scissors vs Paper", () =>
  assert(Game.compare(items.scissors, items.paper) === "win"));

Deno.test("Scissors vs Rock", () =>
  assert(Game.compare(items.scissors, items.rock) === "lose"));
