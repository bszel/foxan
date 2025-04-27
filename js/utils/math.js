export function subtractVectors(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

export function negateVector(v) {
    return { x: -v.x, y: -v.y };
}

export function normalizeVector(v) {
    const length = Math.hypot(v.x, v.y);
    return { x: v.x / length, y: v.y / length };
}

export function getTangentVector(v) {
    return { x: v.y, y: -v.x };
}

export function getNormalVector(v) {
    return normalizeVector(getTangentVector(v));
}

export function vectorLength(v) {
    return Math.hypot(v.x, v.y);
}

export function crossNumberVector(number, vector) {
    return { x: -number * vector.y, y: number * vector.x };
}

export function crossVectorVector(v1, v2) {
    return v1.x * v2.y - v1.y * v2.x;
}

export function scaleVector(v, scalar) {
    return { x: v.x * scalar, y: v.y * scalar };
}

export function addVectors(v1, v2) {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}