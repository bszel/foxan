import { MapManager } from "./mapmanager.js";

export class ServerManager {
    constructor() {
        this.players = [];
        this.mapManager = new MapManager;
        this.currentID = 100;
        this.sessions = [];
    }

    sendInitialData(ws) {
        console.log('New websocket connection');
        const message = {
            type: 'initial',
            objects: this.mapManager.getObjects(),
            playerID: this.getUniqueID()
        }
        ws.send(JSON.stringify(message));
    }

    handleMessage(ws, mess, session) {
        const message = JSON.parse(mess);
        if (message.type == 'player-update') {
            this.handlePlayerUpdate(ws, message.player, session);
        }
        else if (message.type == 'chat-message') {
            this.handleChatMessage(message.chatMessage);
        }
    }

    handlePlayerUpdate(ws, player, session) {
        if (!session.player) {
            session.player = player;
            this.players.push(session.player);
            console.log(`Player ${session.player.id} has joined`);
            const message = {
                playerName: 'SERVER',
                message: `Player ${session.player.id} has joined`
            };
            this.handleChatMessage(message);
        }
        else {
            Object.assign(session.player, player);
        }
        const messagePlayers = {
            type: 'player-update',
            players: this.players
        };
        ws.send(JSON.stringify(messagePlayers));
        const messageText = {
            type: 'chat-message',
            messages: session.chatMessageQueue
        };
        session.chatMessageQueue = [];
        ws.send(JSON.stringify(messageText));
    }

    handleChatMessage(message) {
        for (const session of this.sessions) {
            session.chatMessageQueue.push(message);
        }
    }

    handleClose(session) {
        const index = this.players.indexOf(session.player);
        this.players.splice(index, 1);
        console.log(`Player ${session.player.id} has disconnected`);
        const message = {
            playerName: 'SERVER',
            message: `Player ${session.player.id} has disconnected`
        };
        this.handleChatMessage(message);
    }

    getUniqueID() {
        this.currentID += 1;
        return this.currentID;
    }
}