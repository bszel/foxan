import { drawCircle } from "./draw.js";

export function drawContactPoints(ctx, contacts) {
    contacts.forEach(contact => {
        contact.points.forEach(point => {
            drawCircle(ctx, point.x, point.y, 2, "#ff0000");
        });
    });
}