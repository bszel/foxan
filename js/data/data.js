import { createCircle, createRectangle } from '../physics/objects.js';

export function createObjects() {
    let ground = createRectangle(1, 700, 700, 1600, 50, { color: '#000000', rotation: 45 });
    let rect1 = createRectangle(2, 800, 500, 50, 200, { color: '#00ff00', isDynamic: true, mass: 1, friction: 10 });
    let rect2 = createRectangle(3, 800, 300, 50, 50, { color: '#0000ff', isDynamic: true, rotation: 45, mass: 10 });
    let rect3 = createRectangle(7, 600, 400, 10, 250, { color: '#ff00ff', isDynamic: true, rotation: 30, mass: 10 });
    let ground2 = createRectangle(4, 1200, 400, 50, 600, { color: '#000000', rotation: 20 });
    let ground3 = createRectangle(5, 800, 700, 1600, 50, { color: '#000000', friction: 0 });
    let ground4 = createRectangle(6, 150, 620, 10, 10, { color: '#000000' });
    let circle = createCircle(8, 900, 450, 100, { color: '#000000' });
    let circle2 = createCircle(9, 500, 400, 30, { color: '#ffff00', isDynamic: true, mass: 5 });
    
    let objects = [];
    objects.push(rect1);
    objects.push(rect2);
    objects.push(rect3);
    objects.push(ground);
    objects.push(ground2);
    objects.push(ground3);
    objects.push(circle);
    objects.push(circle2);
    objects.push(ground4);

    return objects;
}

export function multiplayerMap1() {
    let ground1 = createRectangle(1, 700, 700, 1600, 50, { color: '#000000', rotation: 45 });
    let ground2 = createRectangle(4, 1200, 400, 50, 600, { color: '#000000', rotation: 20 });
    let ground3 = createRectangle(5, 800, 700, 1600, 50, { color: '#000000', friction: 0 });
    let circle = createCircle(8, 900, 450, 100, { color: '#000000' });
    
    let objects = [];
    objects.push(ground1);
    objects.push(ground2);
    objects.push(ground3);
    objects.push(circle);

    return objects;
}