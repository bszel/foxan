// Object to track the current state of keys
const keyState = {};

// Add event listeners to track key presses and releases
window.addEventListener('keydown', (event) => {
    keyState[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.key] = false;
});

// Define the keyboard object with methods for specific keys
export const keyboard = {
    w: () => keyState['w'] || keyState['ArrowUp'], // 'W' or Up arrow
    a: () => keyState['a'] || keyState['ArrowLeft'], // 'A' or Left arrow
    d: () => keyState['d'] || keyState['ArrowRight'] // 'D' or Right arrow
};
