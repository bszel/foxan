import { createCircle, createRectangle } from '../physics/objects.js';

export class MapEditor {
    constructor(foxan) {
        this.foxan = foxan;
        this.objects = [];

        this.placeRectangle = this.placeRectangle.bind(this);
        this.placeCircle = this.placeCircle.bind(this);
    }

    placeRectangle(e) {
        let canvas = this.foxan.screen.canvas;
        let canvasPosition = canvas.getBoundingClientRect();
        let id = this.objects.length + 1;
        let x = e.clientX - canvasPosition.left;
        let y = e.clientY - canvasPosition.top;
        let rectangle = createRectangle(id, x, y, 1600, 50, { color: '#000000' });
        this.objects.push(rectangle);
        this.foxan.renderObjects(this.objects);
        canvas.removeEventListener('click', this.placeRectangle);
    }

    placeCircle(e) {
        let canvas = this.foxan.screen.canvas;
        let canvasPosition = canvas.getBoundingClientRect();
        let id = this.objects.length + 1;
        let x = e.clientX - canvasPosition.left;
        let y = e.clientY - canvasPosition.top;
        let circle = createCircle(id, x, y, 100, { color: '#000000' });
        this.objects.push(circle);
        this.foxan.renderObjects(this.objects);
        canvas.removeEventListener('click', this.placeCircle);
    }
}