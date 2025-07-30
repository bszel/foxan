import { createRectangle } from '../js/physics/objects.js';
import https from 'node:https';
import { WebSocketServer } from 'ws';
import fs from 'fs';

const hostname = '0.0.0.0';
const port = 443;

const server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/63666666.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/63666666.xyz/fullchain.pem')
});

const wss = new WebSocketServer({ server });

let players = [];
wss.on('connection', (ws) => {
    console.log('websocket connection');
    const rectangle = createRectangle(5, 800, 700, 1600, 50, { color: '#000000', friction: 1 });
    ws.send(JSON.stringify([rectangle]));

    ws.on('message', (message) => {
        let player = JSON.parse(message);
        let inList = false;
        for (let object of players) {
            if (object.id == player.id) {
                Object.assign(object, player);
                inList = true;
                break;
            }
        }
        if (!inList) {
            players.push(player);
            console.log('new player joined');
        }
        const delayedMessage = JSON.stringify(players);
        setTimeout(() => {
            ws.send(delayedMessage);
        }, 60);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});