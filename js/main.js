import { Screen } from './core/screen.js';
import { GameEngine } from './core/engine.js';
import { Background } from './graphics/background.js'
import { createCircle, createRectangle } from './physics/objects.js';
import { PlayerController } from './physics/movement.js';
import { debugText } from './graphics/debugtext.js';
import { Sprite } from './graphics/sprites.js';
import { drawContactPoints } from './graphics/debug.js';
import { createObjects } from './data/data.js'
import { PhysicsEngine } from './physics/pysicsengine.js';

class Foxan {
    constructor() {
        this.screen = new Screen(1600, 800);
        this.engine = new GameEngine();
        this.physics = new PhysicsEngine();
        this.background = new Background('./resources/images/background.png');
        this.playerSprite = new Sprite(138, 72, './resources/sprites/foxsprite.png');
        
        this.player = createCircle(0, 500, 300, 30, { color: '#ffffff', isPlayer: true, mass: 10, friction: 0.3, rotatable: false });
        this.objects = createObjects();
        this.objects.push(this.player);

        this.playerController = new PlayerController(this.player, this.playerSprite);
    }

    update() {
        this.playerController.update();
        this.physics.update(this.objects);
        this.render();
    }

    render() {
        this.screen.clear();
        this.background.draw(this.screen.ctx, 0, 0);
        debugText(this.screen.ctx, this.player);
        this.objects.forEach(obj => obj.draw(this.screen.ctx));
        this.playerSprite.draw(this.screen.ctx, this.player);
        drawContactPoints(this.screen.ctx, this.physics.getContacts());
    }

    start() {
        this.engine.start(() => this.update());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const foxan = new Foxan();
    foxan.start();
});