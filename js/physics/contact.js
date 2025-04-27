import { collidesRC, collidesRR } from './collision.js';
import { subtractVectors, dotProduct, normalizeVector, negateVector, getTangentVector, getNormalVector } from '../utils/math.js';
import { getCorners } from '../utils/geometry.js';

export function getContacts(objects) {
    let contacts = [];
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            const obj1 = objects[i];
            const obj2 = objects[j];
            const result = getContact(obj1, obj2);
            if (result) {
                contacts.push(result);
            };
        };
    };
    return contacts;
}

function getContact(obj1, obj2) {
    if (!obj1.isDynamic && !obj2.isDynamic) return false;
    if (obj1.shape == 'rect' && obj2.shape == 'rect') {
        return getContactRR(obj1, obj2);
    }
    else if (obj1.shape == 'rect' && obj2.shape == 'circle') {
        return getContactRC(obj1, obj2);
    }
    else if (obj1.shape == 'circle' && obj2.shape == 'rect') {
        return getContactRC(obj2, obj1);
    }
}

function getContactRC(rect, circle) {
    const result = collidesRC(rect, circle);
    if (!result) return null;
    let normal = result.normal;
    const overlap = result.smallestOverlap;
    const point = {
        x: circle.position.x - normal.x * (circle.radius - overlap),
        y: circle.position.y - normal.y * (circle.radius - overlap)
    }
    const tangent = getTangentVector(normal);
    return { obj1: rect, obj2: circle, normal, tangent, overlap, points: [point] };
}

function getContactRR(rect1, rect2) {
    const result = collidesRR(rect1, rect2);
    if (!result) return null;
    let normal = result.normal;
    const overlap = result.smallestOverlap;

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

    if (dotProduct(subtractVectors(rect1.position, rect2.position), normal) > 0) {
        normal = negateVector(normal);
    }
    const tangent = getTangentVector(normal);

    return { obj1: rect1, obj2: rect2, normal, tangent, overlap, points };
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