import https from 'node:https';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import { FoxanSession } from './session.js';
import { ServerManager } from './servermanager.js';

const hostname = '0.0.0.0';
const port = 443;

const server = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/63666666.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/63666666.xyz/fullchain.pem')
});

const wss = new WebSocketServer({ server });

const serverManager = new ServerManager();
wss.on('connection', (ws) => {
    const session = new FoxanSession();
    serverManager.sessions.push(session);
    serverManager.sendInitialData(ws);

    ws.on('message', (message) => {
        serverManager.handleMessage(ws, message, session);
    });

    ws.on('close', () => {
        serverManager.handleClose(session);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at https://${hostname}:${port}/`);
});