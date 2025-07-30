import { FoxanObject } from "../physics/objects.js";

export class MultiplayerManager {
    constructor(foxan) {
        this.ws = null;
        this.foxan = foxan;
        this.online = false;
    }

    start(ip) {
        this.ws = new WebSocket(`ws://${ip}:3000`);
        this.online = true;

        this.ws.addEventListener('message', (event) => {
            const objectsRaw = JSON.parse(event.data);
            const newOjbects = [];
            for (const objRaw of objectsRaw) {
                let object = null;
                for (const obj of this.foxan.objects) {
                    if (obj.id == objRaw.id) {
                        object = obj;
                        if (this.foxan.player.id != object.id) {
                            obj.setAttributes(objRaw);
                        }
                        break;
                    }
                }
                if (!object) {
                    object = new FoxanObject(objRaw.id, objRaw.shape, objRaw.position.x, objRaw.position.y, { color: objRaw.color });
                    object.setAttributes(objRaw);
                    newOjbects.push(object);
                }
            }
            this.foxan.objects.push.apply(this.foxan.objects, newOjbects);
        });
    }

    sendObject(object) {
        this.ws.send(JSON.stringify(object));
    }

    close() {
        if (!this.ws) return;
        this.ws.close();
        this.online = false;
    }
}