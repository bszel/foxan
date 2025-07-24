import { subtractVectors, dotProduct, negateVector } from "../utils/math.js";
import { getCorners, getAxes, getClosestPointOnRect } from "../utils/geometry.js";

export function collidesCC(circle1, circle2) {
    const d = subtractVectors(circle2.position, circle1.position);
    const distance = Math.hypot(d.x, d.y);
    const radiusSum = circle1.radius + circle2.radius;

    if (distance < radiusSum) {
        const normal = distance > 0 ? { x: d.x / distance, y: d.y / distance } : { x: 0, y: 0 };
        return { normal, smallestOverlap: radiusSum - distance };
    }
    return null;
}

export function collidesRC(rect, circle) {
    const corners = getCorners(rect);
    const axes = getAxes(corners);
    let smallestOverlap = Infinity;
    let normal = null;
    
    // Add one special axis: from rect center to circle center
    const centerToCenter = subtractVectors(circle.position, rect.position);
    const centerAxisLength = Math.hypot(centerToCenter.x, centerToCenter.y);
    if (centerAxisLength > 0) {
        axes.push({
            x: centerToCenter.x / centerAxisLength,
            y: centerToCenter.y / centerAxisLength
        });
    }

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
        const projRect = projectPolygon(axis, corners);
        const projCircle = projectCircle(axis, circle);

        if (!isOverlapping(projRect, projCircle)) {
            return null;
        }

        const overlap = Math.min(projRect.max, projCircle.max) - Math.max(projRect.min, projCircle.min);
        if (overlap < smallestOverlap) {
            smallestOverlap = overlap;
            normal = axis;
        }
    }

    const d = subtractVectors(rect.position, circle.position);
    const dot = dotProduct(d, normal);
    normal = dot < 0 ? normal : negateVector(normal);

    return { normal, smallestOverlap };
}

export function collidesRR(rect1, rect2) {
    const corners1 = getCorners(rect1);
    const corners2 = getCorners(rect2);
    let smallestOverlap = Infinity;
    let normal = null;
    let referenceRect = null;

    function testAxes(corners, rect) {
        const axes = getAxes(corners);
        for (const axis of axes) {
            const proj1 = projectPolygon(axis, corners1);
            const proj2 = projectPolygon(axis, corners2);

            if (!isOverlapping(proj1, proj2)) {
                return null;
            }

            const overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
            if (overlap < smallestOverlap) {
                smallestOverlap = overlap;
                normal = axis;
                referenceRect = rect;
            }
        }
        return true;
    }

    if (!testAxes(corners1, rect1)) return null;
    if (!testAxes(corners2, rect2)) return null;

    const incidentRect = referenceRect === rect1 ? rect2 : rect1;
    const d = subtractVectors(referenceRect.position, incidentRect.position);
    const dot = dotProduct(d, normal);
    normal = dot < 0 ? normal : negateVector(normal);

    return { referenceRect, normal, smallestOverlap };
}

function isOverlapping(proj1, proj2) {
    return proj1.max >= proj2.min && proj2.max >= proj1.min;
}

function projectPolygon(axis, corners) {
    const projections = corners.map(corner => dotProduct(corner, axis));
    return { min: Math.min(...projections), max: Math.max(...projections) };
}

function projectCircle(axis, circle) {
    const centerProjection = dotProduct(circle.position, axis);
    return { min: centerProjection - circle.radius, max: centerProjection + circle.radius };
}

function collidesRP(rect, point) {
    const cos = Math.cos(-rect.rotation);
    const sin = Math.sin(-rect.rotation);
    
    const translatedX = point.x - rect.position.x;
    const translatedY = point.y - rect.position.y;
    
    const localX = translatedX * cos - translatedY * sin;
    const localY = translatedX * sin + translatedY * cos;
    
    const halfWidth = rect.width / 2;
    const halfHeight = rect.height / 2;
    return (
        localX >= -halfWidth &&
        localX <= halfWidth &&
        localY >= -halfHeight &&
        localY <= halfHeight
    );
}

function collidesCP(circle, point) {
    const distance = Math.hypot(
        point.x - circle.position.x,
        point.y - circle.position.y
    );
    return distance <= circle.radius;
}

export function collidesObjectPoint(object, point) {
    if (object.shape == 'rect') {
        return collidesRP(object, point);
    }
    else if (object.shape == 'circle') {
        return collidesCP(object, point);
    }
    return false;
}