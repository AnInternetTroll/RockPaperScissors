#!/usr/bin/env -S deno run --no-check --allow-net --allow-read --unstable --watch
import Game from "./Game.ts";
import { minify } from "https://esm.sh/terser";

interface WsResponseRaw {
  op: number;
  d: unknown;
}

interface WsResponsePing extends WsResponseRaw {
  op: 1;
  d: string;
}

interface WsResponseJoin extends WsResponseRaw {
  op: 2;
  d: {
    name: string;
    against?: string;
  };
}

interface WsResponseChoice extends WsResponseRaw {
  op: 3;
  d: string;
}

export type WsResponse = WsResponsePing | WsResponseJoin | WsResponseChoice;

interface Player {
  ws: WebSocket;
  name: string;
}
type Match = {
  player1: Player;
  player2?: Player;
  results: boolean[];
};

const canRead = (await Deno.permissions.request({ name: "read", path: "./" }))
  .state === "granted";

const cache: Record<string, Uint8Array | null> = {};

const textEncoder = new TextEncoder();
if (!canRead) {
  console.log("Please give permission to read in the current directory");
  Deno.exit(1);
}

export default class Server extends Game {
  port: number;
  matches: Match[];

  constructor(port: number = 3000) {
    super();
    this.port = port;
    this.matches = [];
  }

  static JSMinify(code: string): string {
    return code.split("\n").map((l) =>
      l.trim()
        .replace(/\s*([,:=|+]{1,2})\s+/g, "$1")
        .replaceAll(") {", "){")
    ).join("");
  }

  async startServer() {
    const listener = Deno.listen({ port: this.port });
    console.log(`Listening on http://localhost:${this.port}`);
    for await (const conn of listener) {
      this.handleConn(conn);
    }
  }

  async handleConn(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const e of httpConn) {
      try {
        this.handle(e);
      } catch (err) {
        console.log(err);
        continue;
      }
    }
  }

  handle(e: Deno.RequestEvent) {
    if (e.request.headers.get("upgrade") != "websocket") {
      this.handleHttp(e);
    } else {
      this.handleWebsocket(e);
    }
  }

  handleWebsocket(e: Deno.RequestEvent): void {
    const { socket, response } = Deno.upgradeWebSocket(e.request);
    let matchIndex: number;
    socket.onclose = () => matchIndex && this.matches.splice(matchIndex, 1);
    socket.onopen = () => console.log("socket opened");
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data) as WsResponse;
      switch (data.op) {
        // Ping
        case 1: {
          socket.send(JSON.stringify({ d: data.d }));
          break;
        }
        // Join
        case 2: {
          if (data.d?.against) {
            const matchAvailable = this.matches.find((match, index) => {
              matchIndex = index;
              return match.player1.name === data.d.against;
            });
            if (matchAvailable) {
              socket.send(
                JSON.stringify({
                  op: 2,
                  d: {
                    status: "waiting",
                    rules: this.rules,
                    msg: "Waiting for player1",
                  },
                }),
              );
              this.match(matchAvailable.player1.ws, socket, matchIndex);
            } else {
              socket.send(JSON.stringify({ op: 9, d: "Not found" }));
              socket.close(404);
            }
          } else {
            matchIndex = this.matches.push({
              player1: { ws: socket, name: data.d.name },
              results: [],
            });
            socket.send(
              JSON.stringify({
                op: 2,
                d: {
                  status: "waiting",
                  rules: this.rules,
                  msg: "Waiting for player2",
                },
              }),
            );
          }
          break;
        }
        // Make a choice is handled by this.match
        case 3: {
          break;
        }
      }
    };
    socket.onerror = (e) =>
      console.log("socket errored:", (e as ErrorEvent).message);
    socket.onclose = () => console.log("socket closed");
    e.respondWith(response);
  }

  async handleHttp(e: Deno.RequestEvent) {
    // coding is wack
    const path = new URL(e.request.url).pathname;
    const pathToFile = `.${
      path.split("/").at(-1) ? path : `${path}index.html`
    }`;
    try {
      let file: Uint8Array;
      const ext = path.split(".").at(-1);
      if (cache[pathToFile]) file = cache[pathToFile]!;
      else if (!ext?.includes("ts")) {
        file = await Deno.readFile(
          pathToFile,
        );
        cache[pathToFile] = file;
      }
      let contentType = "";
      switch (ext) {
        case "svg": {
          contentType = "image/svg+xml";
          break;
        }
        case "mp3": {
          contentType = "audio/mpeg";
          break;
        }
        case "js":
          contentType = "application/javascript";
          break;
        case "tsx":
        case "ts": {
          contentType = "application/javascript";
          if (!cache[pathToFile]) {
            const { files } = await Deno.emit(pathToFile, {
              check: false,
              bundle: "module",
              compilerOptions: {
                // inlineSourceMap: true,
              },
            });
            for (const [_, text] of Object.entries(files)) {
              cache[pathToFile] = textEncoder.encode(
                (await minify(text, {
                  toplevel: true,
                })).code,
              );
              return e.respondWith(
                new Response(cache[pathToFile], {
                  headers: { "Content-Type": contentType },
                }),
              );
            }
          } else {
            return e.respondWith(
              new Response(cache[pathToFile], {
                headers: { "Content-Type": contentType },
              }),
            );
          }
          break;
        }
        case "html":
          contentType = "text/html";
          break;
        case "json":
          contentType = "application/json";
          break;
        case "css":
          contentType = "text/css";
          break;
        default:
          contentType = "text/html";
          break;
      }
      e.respondWith(
        new Response(file!, {
          headers: { "Content-Type": contentType },
        }),
      );
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) {
        e.respondWith(new Response("Not found", { status: 404 }));
      } else {
        console.log(err);
        e.respondWith(
          new Response(`Something went baaaaad\n${JSON.stringify(err)}`, {
            status: 500,
          }),
        );
      }
    }
  }

  async watchForChangesAndRemoveFromCache() {
    const fsWatcher = Deno.watchFs("./");
    for await (const change of fsWatcher) {
      if (change.kind === "modify") {
        const paths = change.paths.map((path) => {
          const folders = path.split("/");
          return folders.slice(folders.findIndex((f) => f === ".")).join("/");
        });
        for (const path in paths) cache[paths[path]] = null;
      }
    }
  }

  start(): Promise<void> {
    this.watchForChangesAndRemoveFromCache();
    return this.startServer();
  }

  async match(
    player1Socket: WebSocket,
    player2Socket: WebSocket,
    matchIndex: number,
  ): Promise<void> {
    for (let i = 0; i < this.tries; i++) {
      const matchResults = this.matches[matchIndex].results;
      if (
        matchResults.filter((res) => res).length >= this.triesLimit ||
        matchResults.filter((res) => !res).length >= this.triesLimit
      ) {
        break;
      }
      player1Socket.send(
        JSON.stringify({
          op: 2,
          d: { status: "ready", msg: "Player 2 joined", rules: this.rules },
        }),
      );
      player2Socket.send(
        JSON.stringify({
          op: 2,
          d: { status: "ready", msg: "Player 1 joined", rules: this.rules },
        }),
      );
      matchResults.push(await this.round(player1Socket, player2Socket));
    }
  }

  round(player1Socket: WebSocket, player2Socket: WebSocket): Promise<boolean> {
    let player1Res = "";
    let player2Res = "";

    return new Promise<boolean>((resolve) => {
      player1Socket.onmessage = (message) => {
        const data = JSON.parse(message.data) as WsResponse;
        console.log(data);
        if (data.op === 3) player1Res = data.d;
        if (!player2Res) {
          player1Socket.send(
            JSON.stringify({ op: 202, d: "Waiting on player2" }),
          );
        } else {
          return resolve(
            this.comparePlayers(
              player1Socket,
              player2Socket,
              player1Res,
              player2Res,
            ),
          );
        }
      };
      player2Socket.onmessage = (message) => {
        const data = JSON.parse(message.data) as WsResponse;
        console.log(data);
        if (data.op === 3) player2Res = data.d;
        if (!player1Res) {
          player2Socket.send(
            JSON.stringify({ op: 202, d: "Waiting on player1" }),
          );
        } else {
          return resolve(
            this.comparePlayers(
              player1Socket,
              player2Socket,
              player1Res,
              player2Res,
            ),
          );
        }
      };
    });
  }

  comparePlayers(
    player1Socket: WebSocket,
    player2Socket: WebSocket,
    player1Res: string,
    player2Res: string,
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      console.log(player1Res, player2Res);
      const player1Item = this.items.find((item) => item.name === player1Res);
      const player2Item = this.items.find((item) => item.name === player2Res);
      if (player1Item && player2Item) {
        const result = Server.compare(player1Item, player2Item);
        player1Socket.send(JSON.stringify({ op: 3, d: player2Item.name }));
        player2Socket.send(
          JSON.stringify({
            op: 3,
            d: player1Item.name,
          }),
        );
        resolve(result === "win");
      } else {
        // fucking kill me
      }
    });
  }
}

const server = new Server(3000);

server.start();
