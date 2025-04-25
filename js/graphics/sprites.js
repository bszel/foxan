export class Sprite {
    constructor(width, height, imageSrc) {
        this.position = { x: 0, y: 0 };
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
        this.animCounter = 0;
        this.side = 0;
        this.playAnimation = false;
    }

    update(player) {
        if (this.playAnimation) {
            this.animCounter += 0.2;
            this.playAnimation = false;
        }
        this.position.x = player.position.x - (this.width / 5) * (2.02 + this.side);
        this.position.y = player.position.y - this.height / 2;
    }

    draw(ctx, player) {
        this.update(player);
        const frameWidth = this.image.width / 16;
        const walkingMod = Math.floor(this.animCounter) % 8;
        const frameStart = (this.side * 8 + walkingMod) * frameWidth;
        ctx.drawImage(
            this.image, frameStart, 0, frameWidth, this.image.height, 
            this.position.x, this.position.y, this.width, this.height);
    }
}