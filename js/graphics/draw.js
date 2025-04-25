export function drawRect(ctx, x, y, w, h, rotation, color) {
    ctx.fillStyle = color;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.translate(-x, -y);
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.translate(x, y);
    ctx.rotate(-rotation);
    ctx.translate(-x, -y);
}

export function drawCircle(ctx, x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

export function drawText(ctx, text, x, y, fontSize, fontType) {
    ctx.font = fontSize + " " + fontType;
    ctx.fillStyle = "black";
    ctx.fillText(text, x, y);
}