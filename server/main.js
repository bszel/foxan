import { createRectangle } from '../js/physics/objects.js';
import http from 'node:http';
import { WebSocketServer } from 'ws';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log('http connection');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!\n');
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
    console.log(`Server running at http://${hostname}:${port}/`);
});