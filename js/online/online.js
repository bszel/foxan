import { FoxanObject } from "../physics/objects.js";
import { FoxanSession } from "./session.js";

export class MultiplayerManager {
    constructor(foxan) {
        this.ws = null;
        this.foxan = foxan;
        this.online = false;
        this.session = null;
    }

    start(ip) {
        this.ws = new WebSocket(`wss://${ip}`);

        this.ws.addEventListener('open', () => {
            this.online = true;
            this.session = new FoxanSession();
        });

        this.ws.addEventListener('message', (message) => {
            if (!this.session.map) {
                const rawData = JSON.parse(message.data);
                const objectsRaw = rawData.objects;
                const playerID = rawData.playerID;
                let objects = [];
                objectsRaw.forEach(objRaw => {
                    let object = new FoxanObject(objRaw.id, objRaw.shape, objRaw.position.x, objRaw.position.y, { color: objRaw.color });
                    object.setAttributes(objRaw);
                    objects.push(object);
                });
                this.session.map = objects;
                this.foxan.startGame(this.session.map, playerID);
                this.session.player = this.foxan.player;
                this.session.players = [this.session.player];
            }
            else {
                const playersRaw = JSON.parse(message.data);
                const updatedPlayers = [this.session.player];
                for (const objRaw of playersRaw) {
                    const existingPlayer = this.session.players.find(p => p.id === objRaw.id);
                    if (existingPlayer) {
                        if (this.session.player.id !== existingPlayer.id) {
                            existingPlayer.setAttributes(objRaw);
                            updatedPlayers.push(existingPlayer);
                        }
                    }
                    else {
                        const newPlayer = new FoxanObject(objRaw.id, objRaw.shape, objRaw.position.x, objRaw.position.y, { color: objRaw.color });
                        newPlayer.setAttributes(objRaw);
                        updatedPlayers.push(newPlayer);
                    }
                }
                this.session.players = updatedPlayers;
                this.foxan.players = updatedPlayers;
            }
        });

        this.ws.addEventListener('close', () => {
            if (this.online) {
                alert('Server disconnected');
                this.online = false;
                this.session = null;
            }
        });
    }

    sendObject(object) {
        if (this.online) {
            this.ws.send(JSON.stringify(object));
        }
    }

    close() {
        if (!this.ws) return;
        this.ws.close();
        this.online = false;
        this.session = null;
    }
}