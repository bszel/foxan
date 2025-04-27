import { subtractVectors, dotProduct, negateVector, normalizeVector, getTangentVector, getNormalVector } from "../utils/math.js";

export function checkCollision(obj1, obj2, contacts) {
    if (!obj1.isDynamic && !obj2.isDynamic) return false;
    if (obj1.shape == 'rect' && obj2.shape == 'rect') {
        const result = getContactsRR(obj1, obj2);
        if (result) {
            contacts.push(result);
        }
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

function getContactsRR(rect1, rect2) {
    const result = collidesRR(rect1, rect2);
    if (!result) return null;
    let normal = result.normal;
    const smallestOverlap = result.smallestOverlap;

    const referenceRect = result.referenceRect;
    const referenceFace = findFaceAlongNormal(referenceRect, normal);

    const incidentRect = referenceRect === rect1 ? rect2 : rect1;
    const incidentFace = findFaceAlongNormal(incidentRect, negateVector(normal));

    const referenceDirection = normalizeVector(subtractVectors(referenceFace.corner2, referenceFace.corner1));
    const referenceOffsetRight = -dotProduct(referenceFace.corner1, referenceDirection);
    const clipRight = clipIncidentFace(incidentFace.corner1, incidentFace.corner2,
        negateVector(referenceDirection), referenceOffsetRight);

    if (!clipRight) return null;

    const referenceOffsetLeft = dotProduct(referenceFace.corner2, referenceDirection);
    const clipLeft = clipIncidentFace(clipRight[0], clipRight[1],
        referenceDirection, referenceOffsetLeft);

    if (!clipLeft) return null;
    
    const points = clipLeft.filter(point => pointBelowReferenceFace(point, referenceFace));

    if (dotProduct(subtractVectors(rect1.position, rect2.position), normal) < 0) {
        normal = negateVector(normal);
    }
    const tangent = getTangentVector(normal);

    return { rect1, rect2, normal, tangent, smallestOverlap, points };
}

function pointBelowReferenceFace(point, referenceFace) {
    const begin = referenceFace.corner1;
    const end = referenceFace.corner2;
    
    // Calculate the cross product to determine which side of the line the point is on
    const crossProduct = (end.x - begin.x) * (point.y - begin.y) - (end.y - begin.y) * (point.x - begin.x);
    return crossProduct >= 0; // Returns true if the point is "below" the reference face
}

function clipIncidentFace(start, end, clipDirection, clipOffset) {
    const direction = normalizeVector(clipDirection);

    const startDot = dotProduct(start, direction) - clipOffset;
    const endDot = dotProduct(end, direction) - clipOffset;

    const points = [];

    if (startDot <= 0) points.push(start);
    if (endDot <= 0) points.push(end);
    if (startDot * endDot < 0) {
        const t = startDot / (startDot - endDot);
        const intersection = {
            x: start.x + t * (end.x - start.x),
            y: start.y + t * (end.y - start.y)
        };
        points.push(intersection);
    }
    if (points.length < 2) {
        return null;
    }

    return points;
}

function findFaceAlongNormal(rect, normal) {
    const corners = getCorners(rect);
    let maxDot = -Infinity;
    let bestFace = null;
    for (let i = 0; i < corners.length; i++) {
        const nextIndex = (i + 1) % corners.length;
        const edge = subtractVectors(corners[nextIndex], corners[i]);
        const edgeNormal = getNormalVector(edge);
        const dot = dotProduct(edgeNormal, normal);
        if (dot > maxDot) {
            maxDot = dot;
            bestFace = { corner1: corners[i], corner2: corners[nextIndex] };
        }
    }
    return bestFace;
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
    let normal = null;

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
            return null;
        }

        const overlap = Math.min(projRect.max, projCircle.max) - Math.max(projRect.min, projCircle.min);
        if (overlap < smallestOverlap) {
            smallestOverlap = overlap;
            const d = subtractVectors(circle.position, rect.position);
            const dot = dotProduct(d, axis);
            normal = dot < 0 ? axis : negateVector(axis);
        }
    }

    return { normal, smallestOverlap };
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
    let smallestOverlap = Infinity;
    let normal = null;
    let referenceRect = null;

    function testAxes(corners, rect) {
        for (let i = 0; i < corners.length; i++) {
            const p1 = corners[i];
            const p2 = corners[(i + 1) % corners.length];
            const edge = subtractVectors(p2, p1);
            const axis = getNormalVector(edge);
            
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

function getCorners(rect) {
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