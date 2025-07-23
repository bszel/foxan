import { getContacts } from '../physics/contact.js';
import { solveConstraints } from '../physics/resolve.js';

export class PhysicsEngine {
    constructor() {
        this.contacts = []
        this.oldContacts = [];
    }

    update(objects) {
        this.applyGravity(objects, 0.1)
        this.contacts = getContacts(objects);
        solveConstraints(this.contacts, this.oldContacts);
        objects.forEach(obj => obj.update());
        this.oldContacts = this.contacts;
    }

    applyGravity(objects, gravity) {
        objects.forEach(obj => obj.applyImpulse({ x: 0, y: gravity * obj.mass }, obj.position));
    }

    getContacts() {
        return this.contacts;
    }
}