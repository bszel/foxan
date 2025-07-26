import { Screen } from './core/screen.js';
import { GameEngine } from './core/engine.js';
import { Background } from './graphics/background.js'
import { createCircle, createRectangle } from './physics/objects.js';
import { PlayerController } from './physics/movement.js';
import { debugText } from './graphics/debugtext.js';
import { Sprite } from './graphics/sprites.js';
import { drawContactPoints } from './graphics/debug.js';
import { PhysicsEngine } from './physics/pysicsengine.js';
import { initializeButtons } from './gui/buttons.js';
import { MapEditor } from './mapeditor/mapeditor.js';

class Foxan {
    constructor() {
        this.screen = new Screen(1600, 800);
        this.engine = new GameEngine();
        this.physics = new PhysicsEngine();
        this.mapEditor = new MapEditor(this);
        this.background = new Background('./resources/images/background.png');
        this.playerSprite = new Sprite(138, 72, './resources/sprites/foxsprite.png');
        initializeButtons(this);
        this.state = 'menu';
        this.engine.start(() => this.update());
    }

    update() {
        if (this.state == 'menu') return;
        else if (this.state == 'game') {
            this.playerController.update();
            this.physics.update(this.objects);
            this.render();
        }
        else if (this.state == 'editor') {
            this.mapEditor.update();
        }
    }

    render() {
        this.renderObjects(this.objects);
        this.playerSprite.draw(this.screen.ctx, this.player);
        drawContactPoints(this.screen.ctx, this.physics.getContacts());
        debugText(this.screen.ctx, this.player);
    }

    renderObjects(objects) {
        this.screen.clear();
        this.background.draw(this.screen.ctx, 0, 0);
        objects.forEach(obj => obj.draw(this.screen.ctx));
    }

    startGame(objects) {
        this.mapEditor.exit();
        this.player = createCircle(0, 500, 300, 30, { color: '#ffffff', isPlayer: true, mass: 10, friction: 0.3, rotatable: false });
        this.playerController = new PlayerController(this.player, this.playerSprite);
        this.objects = objects;
        this.objects.push(this.player);
        this.state = 'game';
    }

    exit() {
        this.screen.clear();
        this.mapEditor.exit();
        this.state = 'menu';
    }

    startEditor(keepObjects) {
        if (keepObjects) {
            const objects = this.objects.filter(object => object.isPlayer === false);
            this.mapEditor.start(objects);
        }
        else {
            this.mapEditor.start([]);
        }
        this.state = 'editor';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const foxan = new Foxan();
});