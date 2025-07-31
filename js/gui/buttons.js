import { createObjects } from '../data/data.js'

export function initializeButtons(foxan) {
    const startButton = document.getElementById('start-button');
    const exitButton = document.getElementById('exit-button');
    const mapEditorSection = document.getElementById('map-editor-section');
    const mapEditorButton = document.getElementById('map-editor-button');
    const backToMapEditorButton = document.getElementById('back-to-map-editor-button');
    const addRectangleButton = document.getElementById('add-rectangle-button');
    const addCircleButton = document.getElementById('add-circle-button');
    const multiplayerButton = document.getElementById('multiplayer-button');
    const multiplayerIPSection = document.getElementById('multiplayer-ip-section');
    const multiplayerIPSubmit = document.getElementById('multiplayer-ip-submit');
    const chatSection = document.getElementById('chat-section');
    startButton.onclick = function () {
        let objects = foxan.mapEditor.objects;
        if (objects.length == 0) {
            objects = createObjects();
        }
        foxan.startGame(objects, 0);
        startButton.hidden = true;
        exitButton.hidden = false;
        mapEditorSection.hidden = true;
        mapEditorButton.hidden = true;
        backToMapEditorButton.hidden = false;
        multiplayerButton.hidden = true;
    };
    exitButton.onclick = function () {
        foxan.exit();
        startButton.hidden = false;
        exitButton.hidden = true;
        mapEditorButton.hidden = false;
        backToMapEditorButton.hidden = true;
        multiplayerButton.hidden = false;
        multiplayerIPSection.hidden = true;
        chatSection.hidden = true;
    };
    mapEditorButton.onclick = function () {
        mapEditorSection.hidden = false;
        mapEditorButton.hidden = true;
        foxan.startEditor(false);
        multiplayerButton.hidden = true;
    };
    backToMapEditorButton.onclick = function () {
        startButton.hidden = false;
        exitButton.hidden = true;
        mapEditorSection.hidden = false;
        backToMapEditorButton.hidden = true;
        multiplayerButton.hidden = true;
        foxan.startEditor(true);
    }
    addRectangleButton.onclick = function () {
        foxan.mapEditor.addRectangle();
    };
    addCircleButton.onclick = function () {
        foxan.mapEditor.addCircle();
    };
    multiplayerButton.onclick = function () {
        startButton.hidden = true;
        multiplayerButton.hidden = true;
        exitButton.hidden = false;
        mapEditorSection.hidden = true;
        mapEditorButton.hidden = true;
        multiplayerIPSection.hidden = false;
    }
    multiplayerIPSubmit.onclick = function () {
        const ip = document.getElementById('multiplayer-ip-text').value;
        multiplayerIPSection.hidden = true;
        foxan.connectOnline(ip);
        chatSection.hidden = false;
    }
}