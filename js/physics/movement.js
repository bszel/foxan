import { keyboard } from "../core/keyboard.js";

const speedLimit = 3;
const acceleration = 0.25;

export class PlayerController {
    constructor(player, playerSprite) {
        this.player = player;
        this.playerSprite = playerSprite;
        this.movementActive = false;
        this.direction = null;
        this.leftOld = false;
        this.rightOld = false;
    }

    handleUp() {
        if (this.player.jump) {
            this.player.speed.y = -3;
            this.player.jump = false;
        }
    }

    handleLeft() {
        const impulse = this.player.speed.x > -speedLimit ? Math.max(-acceleration, -speedLimit - this.player.speed.x) : 0;
        this.player.applyImpulse({ x: impulse * this.player.mass, y: 0 }, this.player.position);
        this.playerSprite.side = 0;
    }

    handleRight() {
        const impulse = this.player.speed.x < speedLimit ? Math.min(acceleration, speedLimit - this.player.speed.x) : 0;
        this.player.applyImpulse({ x: impulse * this.player.mass, y: 0 }, this.player.position);
        this.playerSprite.side = 1;
    }

    update() {
        const left = keyboard.a();
        const right = keyboard.d();
        const up = keyboard.w();

        if (left || right) {
            // Determine movement direction
            if (!left && right) { // only right pressed
                this.direction = 'right';
            }
            else if (left && !right) { // only left pressed
                this.direction = 'left';
            }
            else if (left && !this.leftOld) { // left pressed this frame
                this.direction = 'left';
            }
            else if (right && !this.rightOld) { // right pressed this frame
                this.direction = 'right';
            }
            // if neither case is true, then both keys are pressed, and the most recently pressed key will be used

            // Handle movement based on the direction
            if (this.direction == 'right') {
                this.handleRight();
            }
            else if (this.direction == 'left') {
                this.handleLeft();
            }

            // Play running animation if player isn't jumping
            if (this.player.jump) {
                this.playerSprite.playAnimation = true;
            }

            this.movementActive = true;
        }
        else if (this.movementActive) { // Decrease player speed in the frame in which the keys are released
            this.player.speed.x /= 2;
            this.movementActive = false;
        }

        if (up) {
            this.handleUp();
        }

        // Update the old state of the keys
        this.leftOld = left;
        this.rightOld = right;
    }
}
