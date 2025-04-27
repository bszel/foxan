import { subtractVectors, getNormalVector } from "./math.js";

export function getCorners(rect) {
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;

    const corners = [
        { x: -halfWidth, y: -halfHeight },
        { x: halfWidth, y: -halfHeight },
        { x: halfWidth, y: halfHeight },
        { x: -halfWidth, y: halfHeight }
    ];

    const cos = Math.cos(rect.rotation);
    const sin = Math.sin(rect.rotation);

    return corners.map(corner => ({
        x: rect.position.x + corner.x * cos - corner.y * sin,
        y: rect.position.y + corner.x * sin + corner.y * cos
    }));
}

export function getAxes(corners) {
    const axes = [];
    for (let i = 0; i < corners.length; i++) {
        const p1 = corners[i];
        const p2 = corners[(i + 1) % corners.length];
        const edge = subtractVectors(p2, p1);
        const axis = getNormalVector(edge);
        axes.push(axis);
    }
    return axes;
}

export function getClosestPointOnRect(rect, point) {
    // Transform point to rectangle's local space
    const cos = Math.cos(-rect.rotation);
    const sin = Math.sin(-rect.rotation);
    const localPoint = {
        x: (point.x - rect.position.x) * cos - (point.y - rect.position.y) * sin,
        y: (point.x - rect.position.x) * sin + (point.y - rect.position.y) * cos
    };

    // Clamp to rectangle bounds
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    const clamped = {
        x: Math.max(-halfWidth, Math.min(halfWidth, localPoint.x)),
        y: Math.max(-halfHeight, Math.min(halfHeight, localPoint.y))
    };

    // Transform back to world space
    return {
        x: rect.position.x + clamped.x * Math.cos(rect.rotation) - clamped.y * Math.sin(rect.rotation),
        y: rect.position.y + clamped.x * Math.sin(rect.rotation) + clamped.y * Math.cos(rect.rotation)
    };
}