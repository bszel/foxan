import { subtractVectors, dotProduct, negateVector } from "../utils/math.js";

export function checkCollision(obj1, obj2) {
    if (!obj1.isDynamic && !obj2.isDynamic) return false;
    if (obj1.shape == 'rect' && obj2.shape == 'rect') {
        return collidesRR(obj1, obj2);
    }
    else if (obj1.shape == 'rect' && obj2.shape == 'circle') {
        return collidesRC(obj1, obj2);
    }
    else if (obj1.shape == 'circle' && obj2.shape == 'rect') {
        return collidesRC(obj2, obj1);
    }
    else return false;
}

function collidesRC(rect, circle) {
    const rectCorners = getCorners(rect);
    const axes = getAxes(rectCorners);
    
    // Add one special axis: from rect center to circle center
    const centerToCenter = subtractVectors(circle.position, rect.position);
    const centerAxisLength = Math.hypot(centerToCenter.x, centerToCenter.y);
    if (centerAxisLength > 0) {
        axes.push({
            x: centerToCenter.x / centerAxisLength,
            y: centerToCenter.y / centerAxisLength
        });
    }

    let smallestOverlap = Infinity;
    let mtvAxis = null;

    // Find closest point on rectangle to circle
    const closestPoint = getClosestPointOnRect(rect, circle.position);
    const closestAxis = subtractVectors(circle.position, closestPoint);
    const closestAxisLength = Math.hypot(closestAxis.x, closestAxis.y);
    if (closestAxisLength > 0) {
        axes.push({
            x: closestAxis.x / closestAxisLength,
            y: closestAxis.y / closestAxisLength
        });
    }

    for (const axis of axes) {
        const projRect = projectPolygon(axis, rectCorners);
        const projCircle = projectCircle(axis, circle);

        if (!isOverlapping(projRect, projCircle)) {
            return { colliding: false, mtv: null };
        }

        const overlap = Math.min(projRect.max, projCircle.max) - Math.max(projRect.min, projCircle.min);
        if (overlap < smallestOverlap) {
            smallestOverlap = overlap;
            // MTV direction should point from rect to circle
            const d = subtractVectors(circle.position, rect.position);
            const dot = dotProduct(d, axis);
            mtvAxis = dot < 0 ? axis : negateVector(axis);
        }
    }

    const mtv = {
        x: mtvAxis.x * smallestOverlap,
        y: mtvAxis.y * smallestOverlap
    };
    return { colliding: true, mtv };
}

function getClosestPointOnRect(rect, point) {
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

function projectCircle(axis, circle) {
    const centerProjection = dotProduct(circle.position, axis);
    return { min: centerProjection - circle.radius, max: centerProjection + circle.radius };
}

function collidesRR(rect1, rect2) {
    const corners1 = getCorners(rect1);
    const corners2 = getCorners(rect2);
    const axes = getAxes(corners1).concat(getAxes(corners2));
    let smallestOverlap = Infinity;
    let mtvAxis = null;

    for (const axis of axes) {
        const proj1 = projectPolygon(axis, corners1);
        const proj2 = projectPolygon(axis, corners2);

        if (!isOverlapping(proj1, proj2)) {
            return { colliding: false, mtv: null };
        }

        const overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
        if (overlap < smallestOverlap) {
            smallestOverlap = overlap;
            const d = subtractVectors(rect2.position, rect1.position);
            const dot = dotProduct(d, axis);
            mtvAxis = dot < 0 ? negateVector(axis) : axis;
        }
    }

    const mtv = {
        x: mtvAxis.x * smallestOverlap,
        y: mtvAxis.y * smallestOverlap
    };
    return { colliding: true, mtv };
}

function getCorners(rect) {
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;

    const corners = [
        { x: -halfWidth, y: -halfHeight },
        { x: halfWidth, y: -halfHeight },
        { x: -halfWidth, y: halfHeight },
        { x: halfWidth, y: halfHeight }
    ];

    const cos = Math.cos(rect.rotation);
    const sin = Math.sin(rect.rotation);

    return corners.map(corner => ({
        x: rect.position.x + corner.x * cos - corner.y * sin,
        y: rect.position.y + corner.x * sin + corner.y * cos
    }));
}

function getAxes(corners) {
    const axes = [];
    for (let i = 0; i < corners.length; i++) {
        const p1 = corners[i];
        const p2 = corners[(i + 1) % corners.length];
        const edge = subtractVectors(p2, p1);
        const normal = { x: -edge.y, y: edge.x };
        const length = Math.hypot(normal.x, normal.y);
        axes.push({ x: normal.x / length, y: normal.y / length });
    }
    return axes;
}

function projectPolygon(axis, corners) {
    const projections = corners.map(corner => dotProduct(corner, axis));
    return { min: Math.min(...projections), max: Math.max(...projections) };
}

function isOverlapping(proj1, proj2) {
    return proj1.max >= proj2.min && proj2.max >= proj1.min;
}