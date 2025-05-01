import { Screen } from './core/screen.js';
import { GameEngine } from './core/engine.js';
import { Background } from './graphics/background.js'
import { createCircle, createRectangle } from './physics/objects.js';
import { getContacts } from './physics/contact.js';
import { solveConstraints } from './physics/resolve.js';
import { PlayerController } from './physics/movement.js';
import { debugText } from './graphics/debugtext.js';
import { Sprite } from './graphics/sprites.js';
import { drawContactPoints } from './graphics/debug.js';

class Foxan {
    constructor() {
        this.screen = new Screen(1600, 800);
        this.engine = new GameEngine();
        this.background = new Background('./resources/images/background.png');
        this.playerSprite = new Sprite(138, 72, './resources/sprites/foxsprite.png');
        
        this.player = createCircle(0, 500, 300, 30, { color: '#ffffff', isPlayer: true, mass: 10, friction: 0.3, rotatable: false });
        this.ground = createRectangle(1, 700, 700, 1600, 50, { color: '#000000', rotation: 45 });
        this.rect1 = createRectangle(2, 800, 500, 50, 200, { color: '#00ff00', isDynamic: true, mass: 1, friction: 10 });
        this.rect2 = createRectangle(3, 800, 300, 50, 50, { color: '#0000ff', isDynamic: true, rotation: 45, mass: 10 });
        this.rect3 = createRectangle(7, 600, 400, 10, 250, { color: '#ff00ff', isDynamic: true, rotation: 30, mass: 10 });
        this.ground2 = createRectangle(4, 1200, 400, 50, 600, { color: '#000000', rotation: 20 });
        this.ground3 = createRectangle(5, 800, 700, 1600, 50, { color: '#000000', friction: 0 });
        this.ground4 = createRectangle(6, 150, 620, 10, 10, { color: '#000000' });
        this.circle = createCircle(8, 900, 450, 100, { color: '#000000' });
        this.circle2 = createCircle(9, 500, 400, 30, { color: '#ffff00', isDynamic: true, mass: 5 });
        
        this.objects = [];
        this.objects.push(this.player);
        this.objects.push(this.rect1);
        this.objects.push(this.rect2);
        this.objects.push(this.rect3);
        this.objects.push(this.ground);
        this.objects.push(this.ground2);
        this.objects.push(this.ground3);
        this.objects.push(this.circle);
        this.objects.push(this.circle2);
        this.objects.push(this.ground4);
        // for (let i = 0; i < 200; i++) {
        //     this.objects.push(createRectangle(7 + i, 500 + 400 * Math.random(), 200 + 400 * Math.random(), 20, 20, { color: '#000000', rotation: 0, isDynamic: true, mass: 0.1 }));
        // }
        this.playerController = new PlayerController(this.player, this.playerSprite);
        this.contacts = [];
        this.oldContacts = [];
        this.rect1.applyImpulse({ x: 10 * this.rect1.mass, y: 0 }, { x: this.rect1.position.x, y: this.rect1.position.y });
    }

    update() {
        this.oldContacts = this.contacts;
        this.contacts = getContacts(this.objects);
        this.objects.forEach(obj => obj.applyImpulse({ x: 0, y: 0.1 * obj.mass }, obj.position));
        this.playerController.update();
        solveConstraints(this.contacts, this.oldContacts);
        this.objects.forEach(obj => obj.update());
        this.render();
    }

    render() {
        this.screen.clear();
        this.background.draw(this.screen.ctx, 0, 0);
        debugText(this.screen.ctx, this.player);

        this.objects.forEach(obj => obj.draw(this.screen.ctx));
        this.playerSprite.draw(this.screen.ctx, this.player);
        drawContactPoints(this.screen.ctx, this.contacts);
    }

    start() {
        this.engine.start(() => this.update());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const foxan = new Foxan();
    foxan.start();
});