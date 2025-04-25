export class Background {
    constructor(imageSrc) {
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx, x, y) {
        ctx.drawImage(this.image, x, y);
    }
}