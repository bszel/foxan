import { dotProduct } from "../utils/math.js";

export function resolveCollision(obj1, obj2, mtv) {
    const overlapMagnitude = Math.hypot(mtv.x, mtv.y);
    if (overlapMagnitude < 0.001) return;

    const normal = { x: mtv.x / overlapMagnitude, y: mtv.y / overlapMagnitude };

    // Player jump trigger
    if (obj1.isPlayer) obj1.jump = true;
    if (obj2.isPlayer) obj2.jump = true;

    // Position correction
    if (obj1.isDynamic && obj2.isDynamic) {
        obj1.position.x -= mtv.x * 0.5;
        obj1.position.y -= mtv.y * 0.5;
        obj2.position.x += mtv.x * 0.5;
        obj2.position.y += mtv.y * 0.5;
    } else if (obj1.isDynamic) {
        obj1.position.x -= mtv.x;
        obj1.position.y -= mtv.y;
    } else if (obj2.isDynamic) {
        obj2.position.x += mtv.x;
        obj2.position.y += mtv.y;
    }

    // Impulse from collision
    const impulse = calculateImpulse(obj1, obj2, normal);
    applyImpulse(obj1, obj2, impulse);

    // Normal force
    // Friction force
    // Torque
}

function calculateImpulse(obj1, obj2, normal) {
    const relativeVelocity = relativeSpeed(obj1, obj2);
    const impulseMagnitude = -dotProduct(relativeVelocity, normal) / (1 / obj1.mass + 1 / obj2.mass);
    return { x: impulseMagnitude * normal.x, y: impulseMagnitude * normal.y };
}

function applyImpulse(obj1, obj2, impulse) {
    obj1.speed.x -= impulse.x / obj1.mass;
    obj1.speed.y -= impulse.y / obj1.mass;
    obj2.speed.x += impulse.x / obj2.mass;
    obj2.speed.y += impulse.y / obj2.mass;
}

function relativeSpeed(obj1, obj2) {
    return {
        x: obj2.speed.x - obj1.speed.x,
        y: obj2.speed.y - obj1.speed.y
    };
}