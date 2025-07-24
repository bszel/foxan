export class GameEngine {
    constructor() {
        this.timestep = 1000 / 60; // 60 FPS
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
        this.frame = null;
    }

    start(update) {
        const gameLoop = (timestamp) => {
            if (!this.lastFrameTime) this.lastFrameTime = timestamp;

            const deltaTime = timestamp - this.lastFrameTime;
            this.lastFrameTime = timestamp;
            this.accumulatedTime += deltaTime;

            while (this.accumulatedTime >= this.timestep) {
                update();
                this.accumulatedTime -= this.timestep;
            }

            this.frame = requestAnimationFrame(gameLoop);
        };

        this.frame = requestAnimationFrame(gameLoop);
    }

    stop() {
        cancelAnimationFrame(this.frame);
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
    }
}