#!/usr/bin/env -S deno run --no-check --allow-net --allow-read=./ --unstable --watch
import Game from "./Game.ts";

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

if (!canRead) {
  console.log("Please give permission to read in the current directory");
  Deno.exit(1);
}

export default class Server extends Game {
  port: number;
  matches: Match[];
  itemNames: string[];

  constructor(port: number = 3000) {
    super();
    this.port = port;
    this.matches = [];
    this.itemNames = this.items.map((item) => item.name);
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
      this.handle(e);
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
    socket.onopen = () => console.log("socket opened");
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data) as WsResponse;
      console.log(data);
      switch (data.op) {
        // Ping
        case 1: {
          socket.send(JSON.stringify({ d: data.d }));
          break;
        }
        // Join
        case 2: {
          if (data.d?.against) {
            const matchAvailable = this.matches.find((match) =>
              match.player1.name === data.d.against
            );
            if (matchAvailable) {
              this.match(matchAvailable.player1.ws, socket);
            } else {
              socket.send(JSON.stringify({ op: 9, d: "Not found" }));
              socket.close(404);
            }
          } else {
            this.matches.push({
              player1: { ws: socket, name: data.d.name },
              results: [],
            });
            socket.send(JSON.stringify({ op: 4, d: "Waiting for player" }));
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

  handleHttp(e: Deno.RequestEvent) {
    // coding is wack
    const path = new URL(e.request.url).pathname;
    try {
      const file = Deno.readFileSync(
        `./${path.split("/").at(-1) ? path : `${path}index.html`}`,
      );
      let contentType = "";
      const ext = path.split(".").at(-1);
      switch (ext) {
        case "js":
          contentType = "application/javascript";
          break;
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
        new Response(new TextDecoder().decode(file), {
          headers: { "Content-Type": contentType },
        }),
      );
    } catch (err) {
      console.log();
      if (err instanceof Deno.errors.NotFound) {
        e.respondWith(new Response("Not found", { status: 404 }));
      } else {
        e.respondWith(
          new Response(`Something went baaaaad\n${JSON.stringify(err)}`, {
            status: 500,
          }),
        );
      }
    }
  }

  start(): Promise<void> {
    return this.startServer();
  }

  match(player1Socket: WebSocket, player2Socket: WebSocket): void {
    player1Socket.send(JSON.stringify({ op: 2, d: "Player 2 joined" }));
    player2Socket.send(JSON.stringify({ op: 2, d: "Ready" }));
    this.round(player1Socket, player2Socket);
  }

  round(player1Socket: WebSocket, player2Socket: WebSocket): Promise<boolean> {
    let player1Res = "";
    let player2Res = "";

    return new Promise<boolean>((resolve) => {
      player1Socket.onmessage = (message) => {
        const data = JSON.parse(message.data) as WsResponse;
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
      const player1Item = this.items.find((item) => item.name === player1Res);
      const player2Item = this.items.find((item) => item.name === player2Res);
      if (player1Item && player2Item) {
        const result = Server.compare(player1Item, player2Item);
        player1Socket.send(JSON.stringify({ op: 3, d: result }));
        player2Socket.send(
          JSON.stringify({
            op: 3,
            d: result === "win" ? "lose" : (result === "draw" ? "draw" : "win"),
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
