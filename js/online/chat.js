import { addNewMessage, clearChat } from "../gui/chat.js";

export class ChatManager {
    constructor() {
        this.messages = [];
    }

    sendMessage(player, text) {
        const message = {
            playerName: player.id,
            message: text
        };
        return message;
    }

    receiveMessage(playerName, text) {
        addNewMessage(playerName, text);
    }

    clearChat() {
        clearChat();
    }
}