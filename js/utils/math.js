export function subtractVectors(v1, v2) {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

export function negateVector(v) {
    return { x: -v.x, y: -v.y };
}