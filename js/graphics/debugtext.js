import { drawText } from "./draw.js";

export function debugText(ctx, object) {
    const text1 = "Fx: " + object.force.x.toFixed(2) + " ax: " + object.acceleration.x.toFixed(2) + " vx: " + object.speed.x.toFixed(2);
    const text2 = "Fy: " + object.force.y.toFixed(2) + " ay: " + object.acceleration.y.toFixed(2) + " vy: " + object.speed.y.toFixed(2);
    drawText(ctx, text1, 10, 25, "30px", "Consolas");
    drawText(ctx, text2, 10, 50, "30px", "Consolas");
}