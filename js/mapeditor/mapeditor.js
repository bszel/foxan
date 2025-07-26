import { createCircle, createRectangle } from '../physics/objects.js';
import { mouse } from '../core/mouse.js';
import { collidesObjectPoint } from '../physics/collision.js';
import { loadAttributes, removeAttributes, updateAttributes } from '../gui/mapeditor.js';
import { toRadians } from "../utils/math.js";

export class MapEditor {
    constructor(foxan) {
        this.foxan = foxan;
        this.canvas = foxan.screen.canvas;
        this.objects = [];

        this.cursorCollides = this.cursorCollides.bind(this);
        this.selectObject = this.selectObject.bind(this);
        this.rotateObject = this.rotateObject.bind(this);
        this.dragObject = this.dragObject.bind(this);
        this.undragObject = this.undragObject.bind(this);
        this.placeObject = this.placeObject.bind(this);
        this.dragResizeObject = this.dragResizeObject.bind(this);

        this.selectedObject = null;
        this.draggedObject = null;
        this.dragOffset = { x: 0, y: 0 };
        this.placingObject = null;
        this.placing = false;
        this.resizing = false;
        this.resizePosition = { x: 0, y: 0 };
    }

    start(objects) {
        this.objects = objects;
        this.selectedObject = null;
        this.draggedObject = null;
        this.canvas.addEventListener('mousemove', this.cursorCollides);
        this.canvas.addEventListener('mousedown', () => this.selectObject(null));
        this.canvas.addEventListener('mousedown', this.dragObject);
    }
    
    exit() {
        this.objects = [];
        this.selectedObject = null;
        this.draggedObject = null;
        this.placingObject = null;
        this.placing = false;
        this.resizing = false;
        this.canvas.removeEventListener('mousemove', this.cursorCollides);
        this.canvas.removeEventListener('mousedown', () => this.selectObject(null));
        this.canvas.removeEventListener('mousedown', this.dragObject);
        this.canvas.removeEventListener('wheel', this.rotateObject);
        removeAttributes();
    }

    update() {
        if (this.placing) {
            this.placingObject.position = { x: mouse.x(), y: mouse.y() };
            this.foxan.renderObjects([...this.objects, this.placingObject]);
            return;
        }
        if (this.resizing) {
            if (this.placingObject.shape == 'rect') {
                this.placingObject.width = Math.max((mouse.x() - this.resizePosition.x) * 2, 10);
                this.placingObject.height = Math.max((mouse.y() - this.resizePosition.y) * 2, 10);
            }
            else if (this.placingObject.shape == 'circle') {
                const radius = Math.hypot(
                    mouse.x() - this.resizePosition.x,
                    mouse.y() - this.resizePosition.y
                );
                this.placingObject.radius = Math.max(radius, 10);
            }
        }
        else if (this.draggedObject) {
            this.draggedObject.position = { x: mouse.x() - this.dragOffset.x, y: mouse.y() - this.dragOffset.y };
            if (this.selectedObject) {
                updateAttributes(this.selectedObject);
            } 
        }
        this.foxan.renderObjects(this.objects);
    }

    addRectangle() {
        let id = this.objects.length + 1;
        let x = mouse.x();
        let y = mouse.y();        
        let rectangle = createRectangle(id, x, y, 10, 10, { color: '#000000' });
        this.placingObject = rectangle;
        this.placing = true;
        this.canvas.addEventListener('mousedown', this.placeObject);
    }

    addCircle() {
        let id = this.objects.length + 1;
        let x = mouse.x();
        let y = mouse.y();
        let circle = createCircle(id, x, y, 10, { color: '#000000' });
        this.placingObject = circle;
        this.placing = true;
        this.canvas.addEventListener('mousedown', this.placeObject);
    }

    placeObject() {
        this.placingObject.position.x = mouse.x();
        this.placingObject.position.y = mouse.y();
        this.objects.push(this.placingObject);
        this.selectedObject = this.placingObject;
        this.selectObject(this.selectedObject);
        this.placing = false;
        this.resizing = true;
        this.resizePosition = { x: mouse.x(), y: mouse.y() };
        this.canvas.removeEventListener('mousedown', this.placeObject);
        this.canvas.addEventListener('mouseup', this.dragResizeObject);
    }

    dragResizeObject() {
        this.resizing = false;
        this.placingObject = null;
        this.canvas.removeEventListener('mouseup', this.dragResizeObject);
    }

    getHoveredObject() {
        const point = { x: mouse.x(), y: mouse.y() };
        for (const object of this.objects.toReversed()) {
            if (collidesObjectPoint(object, point)) {
                return object;
            }
        }
        return null;
    }

    cursorCollides() {
        this.canvas.style.cursor = this.getHoveredObject() ? "pointer" : "default";
    }

    selectObject(object) {
        if (!object) {
            const hoveredObject = this.getHoveredObject();
            if (!hoveredObject) {
                this.unselectObject();
                return;
            }
            this.selectedObject = hoveredObject;
        }
        else {
            this.selectedObject = object;
        }
        this.canvas.addEventListener('wheel', this.rotateObject);
        removeAttributes();
        loadAttributes(this.selectedObject);
    }

    dragObject() {
        const hoveredObject = this.getHoveredObject();
        if (!hoveredObject) return;
        this.draggedObject = hoveredObject;
        this.dragOffset = { x: mouse.x() - this.draggedObject.position.x, y: mouse.y() - this.draggedObject.position.y };
        this.canvas.addEventListener('mouseup', this.undragObject);
    }

    undragObject() {
        this.draggedObject = null;
        this.dragOffset = { x: 0, y: 0 };
        this.canvas.removeEventListener('mouseup', this.undragObject);
    }

    unselectObject() {
        this.selectedObject = null;
        this.draggedObject = null;
        this.canvas.removeEventListener('wheel', this.rotateObject);
        removeAttributes();
    }

    rotateObject(event) {
        if (event.deltaY < 0) {
            this.selectedObject.rotation -= toRadians(10);
        } else if (event.deltaY > 0) {
            this.selectedObject.rotation += toRadians(10);
        }
        updateAttributes(this.selectedObject);
    }
}