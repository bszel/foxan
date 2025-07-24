let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
    let canvas = document.getElementById('game-canvas');
    let canvasPosition = canvas.getBoundingClientRect();
    mouseX = e.clientX - canvasPosition.left;
    mouseY = e.clientY - canvasPosition.top;
});

export const mouse = {
    x: () => mouseX,
    y: () => mouseY
};