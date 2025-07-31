import { multiplayerMap1 } from "../js/data/data.js";

export class MapManager {
    constructor() {
    }

    getObjects() {
        return multiplayerMap1();
    }
}