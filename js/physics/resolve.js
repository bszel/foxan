import { dotProduct, negateVector, subtractVectors, scaleVector, crossNumberVector, crossVectorVector, addVectors, clamp, getTangentVector } from "../utils/math.js";

export function solveConstraints(contacts, oldContacts) {
    update(contacts, oldContacts);
    preStep(contacts);
    // for (let i = 0; i < 10; i++) {
    //     solvePosition(contacts);
    // }
    for (let i = 0; i < 20; i++) {
        solveVelocity(contacts);
    }
}

function update(contacts, oldContacts) {
    for (const contact of contacts) {
        for (const point of contact.points) {
            point.normalImpulse = 0;
            point.tangentImpulse = 0;
            for (const oldContact of oldContacts) {
                if (oldContact.obj1.id === contact.obj1.id && oldContact.obj2.id === contact.obj2.id) {
                    for (const oldPoint of oldContact.points) {
                        if (point.id === oldPoint.id) {
                            point.normalImpulse = oldPoint.normalImpulse;
                            point.tangentImpulse = oldPoint.tangentImpulse;
                        }
                    }
                }
            }
        }
    }
}

function preStep(contacts) {
    const biasFactor = 0.2;
    const slop = 0.01;
    for (const contact of contacts) {
        const { obj1, obj2, normal, tangent, overlap } = contact;
        for (const point of contact.points) {
            const r1 = subtractVectors(point, obj1.position);
            const r2 = subtractVectors(point, obj2.position);

            const rn1 = crossVectorVector(r1, normal);
            const rn2 = crossVectorVector(r2, normal);

            const rt1 = crossVectorVector(r1, tangent);
            const rt2 = crossVectorVector(r2, tangent);

            const normalMass = 1 / (
                obj1.inverseMass + obj2.inverseMass
                + obj1.inverseInertia * rn1 * rn1
                + obj2.inverseInertia * rn2 * rn2
            );
            const tangentMass = 1 / (
                obj1.inverseMass + obj2.inverseMass
                + obj1.inverseInertia * rt1 * rt1
                + obj2.inverseInertia * rt2 * rt2
            );
            point.normalMass = normalMass;
            point.tangentMass = tangentMass;

            point.bias = -biasFactor * Math.min(0, -overlap + slop);
            point.r1 = r1;
            point.r2 = r2;
            point.friction = Math.sqrt(obj1.friction * obj2.friction);

            // Apply normal + friction impulse
            const impulse = addVectors(
                scaleVector(normal, point.normalImpulse),
                scaleVector(tangent, point.tangentImpulse)
            );
            obj1.applyImpulse(negateVector(impulse), point);
            obj2.applyImpulse(impulse, point);

        }
        if (obj1.isPlayer && obj1.speed.y > 0) obj1.jump = true;
        if (obj2.isPlayer && obj2.speed.y > 0) obj2.jump = true;
    }
}

function solvePosition(contacts) {
    for (const contact of contacts) {
        const { obj1, obj2, normal, overlap } = contact;
        for (const point of contact.points) {
            const steeringFoce = clamp(0.2 * (-overlap + 0.5), -5, 0);
            const impulse = scaleVector(normal, -steeringFoce * point.normalMass);

            if (obj1.isDynamic) {
                obj1.position = addVectors(obj1.position, scaleVector(impulse, -obj1.inverseMass));
                if (obj1.rotatable) {
                    obj1.rotation -= crossVectorVector(impulse, point.r1) * obj1.inverseInertia;
                }
            }
            if (obj2.isDynamic) {
                obj2.position = addVectors(obj2.position, scaleVector(impulse, obj2.inverseMass));
                if (obj2.rotatable) {
                    obj2.rotation += crossVectorVector(impulse, point.r2) * obj2.inverseInertia;
                }
            }
        }
    }
}

function solveVelocity(contacts) {
    for (const contact of contacts) {
        const { obj1, obj2, normal, tangent } = contact;
        for (const point of contact.points) {
            // Calculate contact vectors
            const r1 = subtractVectors(point, obj1.position);
            const r2 = subtractVectors(point, obj2.position);

            // Calculate relative velocity
            let v1 = addVectors(obj1.speed, crossNumberVector(obj1.angularVelocity, r1));
            let v2 = addVectors(obj2.speed, crossNumberVector(obj2.angularVelocity, r2));
            let relativeVelocity = subtractVectors(v2, v1);

            // Normal impulse calculation
            const normalVelocity = dotProduct(relativeVelocity, normal);
            let deltaImpulse = point.normalMass * (-normalVelocity + point.bias);

            // Clamp normal impulse
            const oldImpulse = point.normalImpulse;
            point.normalImpulse = Math.max(point.normalImpulse + deltaImpulse, 0);
            deltaImpulse = point.normalImpulse - oldImpulse;

            // Apply normal impulse
            const normalImpulse = scaleVector(normal, deltaImpulse);
            obj1.applyImpulse(negateVector(normalImpulse), point);
            obj2.applyImpulse(normalImpulse, point);
            
            // Calculate new relative velocity after normal impulse
            v1 = addVectors(obj1.speed, crossNumberVector(obj1.angularVelocity, r1));
            v2 = addVectors(obj2.speed, crossNumberVector(obj2.angularVelocity, r2));
            relativeVelocity = subtractVectors(v2, v1);

            // Tangent impulse calculation
            const tangentVelocity = -dotProduct(relativeVelocity, tangent);
            deltaImpulse = point.tangentMass * (tangentVelocity);

            // Clamp tangent impulse
            const maxTangentImpulse = point.friction * point.normalImpulse;
            const oldTangentImpulse = point.tangentImpulse;
            point.tangentImpulse = clamp(point.tangentImpulse + deltaImpulse, -maxTangentImpulse, maxTangentImpulse);
            deltaImpulse = point.tangentImpulse - oldTangentImpulse;

            // Apply tangent impulse
            const tangentImpulse = scaleVector(tangent, deltaImpulse);
            obj1.applyImpulse(negateVector(tangentImpulse), point);
            obj2.applyImpulse(tangentImpulse, point);
        }
    }
}