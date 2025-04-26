import { Screen } from './core/screen.js';
import { GameEngine } from './core/engine.js';
import { Background } from './graphics/background.js'
import { createCircle, createRectangle } from './physics/objects.js';
import { checkCollision } from './physics/collision.js';
import { resolveCollision } from './physics/resolve.js';
import { PlayerController } from './physics/movement.js';
import { debugText } from './graphics/debugtext.js';
import { Sprite } from './graphics/sprites.js';

class Foxan {
    constructor() {
        this.screen = new Screen(1600, 800);
        this.engine = new GameEngine();
        this.background = new Background('./resources/images/background.png');
        this.playerSprite = new Sprite(138, 72, './resources/sprites/foxsprite.png');
        
        this.player = createCircle(0, 500, 300, 30, { color: '#ff0000', isPlayer: true, mass: 10 });
        this.ground = createRectangle(1, 800, 700, 1600, 50, { color: '#000000', rotation: 45 });
        this.rect1 = createRectangle(2, 800, 600, 50, 50, { color: '#00ff00', isDynamic: true });
        this.rect2 = createRectangle(3, 800, 300, 50, 50, { color: '#0000ff', isDynamic: true, rotation: 45 });
        this.ground2 = createRectangle(4, 1200, 400, 50, 500, { color: '#000000', friction: 1 });
        this.ground3 = createRectangle(5, 800, 700, 1600, 50, { color: '#000000' });
        
        this.objects = [];
        this.objects.push(this.player);
        this.objects.push(this.ground);
        this.objects.push(this.rect1);
        this.objects.push(this.rect2);
        this.objects.push(this.ground2);
        this.objects.push(this.ground3);

        this.playerController = new PlayerController(this.player, this.playerSprite);
    }

    update() {
        this.objects.forEach(obj => obj.update());
        this.objects.forEach(obj => obj.applyForce({ x: 0, y: 0.1 * obj.mass}));

        for (let i = 0; i < this.objects.length; i++) {
            for (let j = i + 1; j < this.objects.length; j++) {
                const obj1 = this.objects[i];
                const obj2 = this.objects[j];
                const result = checkCollision(obj1, obj2);
                
                if (result.colliding) {
                    resolveCollision(obj1, obj2, result.mtv);
                };
            };
        };
        
        this.playerController.update();
        this.render();
    }

    render() {
        this.screen.clear();
        this.background.draw(this.screen.ctx, 0, 0);
        debugText(this.screen.ctx, this.player);

        this.objects.forEach(obj => obj.draw(this.screen.ctx));
        this.playerSprite.draw(this.screen.ctx, this.player);
    }

    start() {
        this.engine.start(() => this.update());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const foxan = new Foxan();
    foxan.start();
});