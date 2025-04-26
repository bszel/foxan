import { drawCircle, drawRect } from "../graphics/draw.js";

export class Object {
    constructor(id, shape, x, y, options) {
        this.id = id;
        this.shape = shape;
        this.position = { x, y };
        this.color = options.color || '#ffffff';
        this.isPlayer = options.isPlayer || false;
        this.isDynamic = options.isDynamic || this.isPlayer;
        this.rotation = options.rotation * Math.PI / 180 || 0;
        this.mass = options.mass || 1;
        this.friction = options.friction || 0.3;

        if (!this.isDynamic) {
            this.mass = Infinity;
        }
        if (this.shape === 'rect') {
            this.width = options.width;
            this.height = options.height;
        }
        else if (this.shape === 'circle') {
            this.radius = options.radius;
        }
        if (this.isPlayer) {
            this.jump = true;
        }

        this.force = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0};
        this.speed = { x: 0, y: 0 };
    }

    applyForce(force) {
        if (!this.isDynamic) return;
        this.force.x += force.x;
        this.force.y += force.y;
    }

    applyImpulse(impulse) {
        if (!this.isDynamic) return;
        this.speed.x += impulse.x / this.mass;
        this.speed.y += impulse.y / this.mass;
    }

    update() {
        if (this.isDynamic) {
            this.acceleration.x = this.force.x / this.mass;
            this.acceleration.y = this.force.y / this.mass;

            this.speed.x += this.acceleration.x;
            this.speed.y += this.acceleration.y;

            this.position.x += this.speed.x;
            this.position.y += this.speed.y;
            
            this.force.x = 0;
            this.force.y = 0;
        }
    }

    draw(ctx) {
        switch(this.shape) {
            case 'rect':
                drawRect(
                    ctx,
                    this.position.x,
                    this.position.y,
                    this.width,
                    this.height,
                    this.rotation,
                    this.color
                );
                break;

            case 'circle':
                drawCircle(
                    ctx,
                    this.position.x,
                    this.position.y,
                    this.radius,
                    this.color
                );
                break;
        }
    }
}

export function createRectangle(id, x, y, width, height, options = {}) {
    return new Object(id, 'rect', x, y, { ...options, width, height });
}

export function createCircle(id, x, y, radius, options = {}) {
    return new Object(id, 'circle', x, y, { ...options, radius });
}