import { MapManager } from "./mapmanager.js";

export class ServerManager {
    constructor() {
        this.players = [];
        this.mapManager = new MapManager;
        this.currentID = 100;
    }

    sendInitialData(ws) {
        console.log('New websocket connection');
        const message = {
            objects: this.mapManager.getObjects(),
            playerID: this.getUniqueID()
        }
        ws.send(JSON.stringify(message));
    }

    handleMessage(ws, message, session) {
        const object = JSON.parse(message);
        if (!session.player) {
            session.player = object;
            this.players.push(session.player);
            console.log(`Player ${session.player.id} joined`);
        }
        else {
            Object.assign(session.player, object);
        }
        ws.send(JSON.stringify(this.players));
    }

    handleClose(session) {
        const index = this.players.indexOf(session.player);
        this.players.splice(index, 1);
        console.log(`Player ${session.player.id} left`);
    }

    getUniqueID() {
        this.currentID += 1;
        return this.currentID;
    }
}