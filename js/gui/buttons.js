import { createObjects } from '../data/data.js'

export function initializeButtons(foxan) {
    const startButton = document.getElementById('start-button');
    const exitButton = document.getElementById('exit-button');
    const mapEditorSection = document.getElementById('map-editor-section');
    const mapEditorButton = document.getElementById('map-editor-button');
    const backToMapEditorButton = document.getElementById('back-to-map-editor-button');
    const addRectangleButton = document.getElementById('add-rectangle-button');
    const addCircleButton = document.getElementById('add-circle-button');
    startButton.onclick = function () {
        let objects = foxan.mapEditor.objects;
        if (objects.length == 0) {
            objects = createObjects();
        }
        foxan.startGame(objects);
        startButton.hidden = true;
        exitButton.hidden = false;
        mapEditorSection.hidden = true;
        mapEditorButton.hidden = true;
        backToMapEditorButton.hidden = false;
    };
    exitButton.onclick = function () {
        foxan.exit();
        startButton.hidden = false;
        exitButton.hidden = true;
        mapEditorButton.hidden = false;
        backToMapEditorButton.hidden = true;
    };
    mapEditorButton.onclick = function () {
        mapEditorSection.hidden = false;
        mapEditorButton.hidden = true;
        foxan.startEditor(false);
    };
    backToMapEditorButton.onclick = function () {
        startButton.hidden = false;
        exitButton.hidden = true;
        mapEditorSection.hidden = false;
        backToMapEditorButton.hidden = true;
        foxan.startEditor(true);
    }
    addRectangleButton.onclick = function () {
        foxan.mapEditor.addRectangle();
    };
    addCircleButton.onclick = function () {
        foxan.mapEditor.addCircle();
    };
}