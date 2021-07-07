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
    players = new MapSchema<Player>()

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }
}

type canvasCoordinates = Array<{ x?: number, y?: number }> 

export default class CanvasRoom extends Room<State> {
    maxClients = 4;
    canvasCoordinates: canvasCoordinates = []

    onCreate(options: unknown) {
        console.log("CanvasRoom created!", options);

        this.setState(new State());

        this.onMessage("CanvasUpdate", (client, coordinate) => {
            this.canvasCoordinates.push(coordinate)
            this.broadcast("CanvasUpdate", coordinate, { except: client });
        });
    }

    onAuth(client: Client, options: unknown, req: unknown) {
        return true;
    }

    onJoin(client: Client) {
        console.log('players', this.state.players)
        this.state.createPlayer(client.sessionId);
        client.send("CanvasHistory", this.canvasCoordinates);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log("Dispose CanvasRoom");
    }

}