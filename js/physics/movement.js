import { keyboard } from "../core/keyboard.js";

export class PlayerController {
    constructor(player, playerSprite) {
        this.player = player;
        this.playerSprite = playerSprite;
    }

    handleUp() {
        if (this.player.jump && keyboard.w()) {
            this.player.speed.y = -3;
            this.playerSprite.playAnimation = false;
            this.player.jump = false;
        }
    }

    handleLeft() {
        if (keyboard.a()) {
            const force = this.player.speed.x > -4 ? -2.5 : 0;
            this.player.applyImpulse({ x: force, y: 0 }, this.player.position);
            this.playerSprite.side = 0;
            if (this.player.jump) {
                this.playerSprite.playAnimation = true;
            }
        }
    }

    handleRight() {
        if (keyboard.d()) {
            const force = this.player.speed.x < 4 ? 2.5 : 0;
            this.player.applyImpulse({ x: force, y: 0 }, this.player.position);
            this.playerSprite.side = 1;
            if (this.player.jump) {
                this.playerSprite.playAnimation = true;
            }
        }
    }

    update() {
        this.handleLeft();
        this.handleRight();
        this.handleUp();
    }
}
