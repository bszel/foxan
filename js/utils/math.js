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
