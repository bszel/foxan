import { drawCircle, drawRect } from "../graphics/draw.js";
import { subtractVectors } from "../utils/math.js";

export class Object {
    constructor(id, shape, x, y, options) {
        this.id = id;
        this.shape = shape;
        this.position = { x, y };
        this.color = options.color || '#ffffff';
        this.isPlayer = options.isPlayer || false;
        this.isDynamic = options.isDynamic || this.isPlayer;
        this.rotation = options.rotation * Math.PI / 180 || 0;
        this.mass = options.mass || 10;
        this.friction = options.friction ?? 0.3;
        this.restitution = options.restitution ?? 0.3;
        this.rotatable = options.rotatable ?? true;

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

        this.acceleration = { x: 0, y: 0};
        this.speed = { x: 0, y: 0 };
        this.angularVelocity = 0;
        this.calculateAttributes();
    }

    // Calculates attributes dependent on other values. Use after changing size or mass
    calculateAttributes() {
        if (!this.isDynamic) {
            this.mass = Infinity;
        }
        else if (this.mass == Infinity) {
            this.mass = 10;
        }

        if (this.shape === 'rect') {
            this.inertia = this.mass * (this.width * this.width + this.height * this.height) / 12;
        }
        else if (this.shape === 'circle') {
            this.inertia = this.mass * this.radius * this.radius / 2;
        }

        this.inverseMass = 1 / this.mass;
        this.inverseInertia = 1 / this.inertia || 0;
    }

    applyImpulse(impulse, point) {
        if (!this.isDynamic) return;
        this.speed.x += impulse.x / this.mass;
        this.speed.y += impulse.y / this.mass;

        if (!this.rotatable) return;
        const r = subtractVectors(point, this.position);
        this.angularVelocity -= (impulse.x * r.y - impulse.y * r.x) / this.inertia;
    }

    update() {
        if (this.isDynamic) {
            this.position.x += this.speed.x;
            this.position.y += this.speed.y;

            this.rotation += this.angularVelocity;
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