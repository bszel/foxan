import { createCircle, createRectangle } from '../physics/objects.js';
import { mouse } from '../core/mouse.js';
import { collidesObjectPoint } from '../physics/collision.js';

export class MapEditor {
    constructor(foxan) {
        this.foxan = foxan;
        this.canvas = foxan.screen.canvas;
        this.objects = [];

        this.placeObject = this.placeObject.bind(this);
        this.cursorCollides = this.cursorCollides.bind(this);
        this.selectObject = this.selectObject.bind(this);

        this.selectedObject = null;
    }

    start() {
        this.objects = [];
        this.selectedObject = null;
        this.canvas.addEventListener('mousemove', this.cursorCollides);
        this.canvas.addEventListener('click', this.selectObject);
    }
    
    exit() {
        this.objects = [];
        this.selectedObject = null;
        this.canvas.removeEventListener('mousemove', this.cursorCollides);
        this.canvas.removeEventListener('click', this.selectObject);
    }

    update() {
        if (!this.selectedObject) return;
        this.selectedObject.position = { x: mouse.x(), y: mouse.y() };
        this.foxan.renderObjects(this.objects);
    }

    addRectangle() {
        let id = this.objects.length + 1;
        let x = mouse.x();
        let y = mouse.y();        
        let rectangle = createRectangle(id, x, y, 1600, 50, { color: '#000000' });
        this.objects.push(rectangle);
        this.selectedObject = rectangle;
    }

    addCircle() {
        let id = this.objects.length + 1;
        let x = mouse.x();
        let y = mouse.y();
        let circle = createCircle(id, x, y, 100, { color: '#000000' });
        this.objects.push(circle);
        this.selectedObject = circle;
    }

    getHoveredObject() {
        const point = { x: mouse.x(), y: mouse.y() };
        for (const object of this.objects) {
            if (collidesObjectPoint(object, point)) {
                return object;
            }
        }
        return null;
    }

    cursorCollides() {
        this.canvas.style.cursor = this.getHoveredObject() ? "pointer" : "default";
    }

    selectObject() {
        const hoveredObject = this.getHoveredObject();
        if (!hoveredObject) return;
        this.selectedObject = hoveredObject;
        this.canvas.addEventListener('click', this.placeObject);
    }

    placeObject() {
        this.selectedObject = null;
        this.canvas.removeEventListener('click', this.placeObject);
        this.canvas.addEventListener('click', this.selectObject);
    }
}