import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

class Player extends Schema {
    @type("number")
    x = null

    @type("number")
    y = null
}

class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    playerDraw(sessionId: string, { x, y }: any) {
        const player = this.players.get(sessionId)
        if(player) {
            if (x) {
                player.x = x
            }
            if (y) {
                player.y = y
            }
        }
    }
}

export default class CanvasRoom extends Room<State> {
    maxClients = 4;

    onCreate(options: unknown) {
        console.log("CanvasRoom created!", options);

        this.setState(new State());

        this.onMessage("canvasUpdate", (client, data) => {
            console.log("CanvasRoom received canvasUpdate from", client.sessionId, ":", data);
            this.state.playerDraw(client.sessionId, data);
        });
    }

    onAuth(client: Client, options: unknown, req: unknown) {
        return true;
    }

    onJoin(client: Client) {
        console.log('players', this.state.players)
        // client.send("hello", "world");
        this.state.createPlayer(client.sessionId);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log("Dispose CanvasRoom");
    }

}