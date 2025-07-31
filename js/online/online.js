import { FoxanObject } from "../physics/objects.js";
import { ChatManager } from "./chat.js";
import { FoxanSession } from "./session.js";

export class MultiplayerManager {
    constructor(foxan) {
        this.ws = null;
        this.foxan = foxan;
        this.online = false;
        this.session = null;
        this.chatManager = null;
    }

    start(ip, playerName) {
        this.ws = new WebSocket(`wss://${ip}`);

        this.ws.addEventListener('open', () => {
            this.online = true;
            this.session = new FoxanSession();
            this.chatManager = new ChatManager();
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
                this.foxan.startGame(this.session.map, playerID, playerName);
                this.session.player = this.foxan.player;
                this.session.players = [this.session.player];
            }
            else {
                const rawData = JSON.parse(message.data);
                if (rawData.type == 'player-update') {
                    const playersRaw = rawData.players;
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
                else if (rawData.type == 'chat-message') {
                    const messages = rawData.messages;
                    for (const message of messages) {
                        const playerName = message.playerName;
                        const text = message.message;
                        this.chatManager.receiveMessage(playerName, text);
                    }
                }
            }
        });

        this.ws.addEventListener('close', () => {
            if (this.online) {
                alert('Server has disconnected');
                this.handleClose();
            }
        });
    }

    sendPlayer(player) {
        if (this.online) {
            const message = {
                type: 'player-update',
                player: player
            };
            this.ws.send(JSON.stringify(message));
        }
    }

    sendMessage(text) {
        const message = {
            type: 'chat-message',
            chatMessage: this.chatManager.sendMessage(this.session.player, text)
        };
        this.ws.send(JSON.stringify(message));
    }

    close() {
        if (!this.ws) return;
        this.ws.close();
        this.handleClose();
    }

    handleClose() {
        this.online = false;
        this.session = null;
        this.chatManager.clearChat();
    }
}