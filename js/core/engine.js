export class GameEngine {
    constructor() {
        this.timestep = 1000 / 60; // 60 FPS
        this.lastFrameTime = 0;
        this.accumulatedTime = 0;
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

            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }
}