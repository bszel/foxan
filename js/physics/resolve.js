import { dotProduct, negateVector } from "../utils/math.js";

export function resolveCollision(obj1, obj2, result) {
    if (result.smallestOverlap < 0.001) return;

    const normal = result.normal;

    // Player jump trigger
    if (obj1.isPlayer) obj1.jump = true;
    if (obj2.isPlayer) obj2.jump = true;

    // Impulse from collision
    const impulse = calculateImpulse(obj1, obj2, normal);
    obj1.applyImpulse(negateVector(impulse));
    obj2.applyImpulse(impulse);

    // Normal force
    // Friction force
    // Torque
}

function calculateImpulse(obj1, obj2, normal) {
    const relativeVelocity = relativeSpeed(obj1, obj2);
    const impulseMagnitude = -dotProduct(relativeVelocity, normal) / (1 / obj1.mass + 1 / obj2.mass);
    return { x: impulseMagnitude * normal.x, y: impulseMagnitude * normal.y };
}

function relativeSpeed(obj1, obj2) {
    return {
        x: obj2.speed.x - obj1.speed.x,
        y: obj2.speed.y - obj1.speed.y
    };
}