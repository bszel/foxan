import { drawText } from "./draw.js";

export function debugText(ctx, object) {
    const text1 = "vx: " + object.speed.x.toFixed(2);
    const text2 = "vy: " + object.speed.y.toFixed(2);
    drawText(ctx, text1, 10, 25, "30px", "Consolas");
    drawText(ctx, text2, 10, 50, "30px", "Consolas");
}