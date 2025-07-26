export class Screen {
    constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });
        this.ctx = this.canvas.getContext('2d');
        this.canvas.id = 'game-canvas';
        this.canvas.width = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}