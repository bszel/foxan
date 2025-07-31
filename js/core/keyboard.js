// Object to track the current state of keys
const keyState = {};

// Add event listeners to track key presses and releases
window.addEventListener('keydown', (event) => {
    keyState[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keyState[event.key] = false;
});

let suspendKeys = false;

export function setSuspendKeys(value) {
    suspendKeys = value;
}

// Define the keyboard object with methods for specific keys
export const keyboard = {
    w: () => (keyState['w'] || keyState['ArrowUp']) && !suspendKeys, // 'W' or Up arrow
    a: () => (keyState['a'] || keyState['ArrowLeft']) && !suspendKeys, // 'A' or Left arrow
    d: () => (keyState['d'] || keyState['ArrowRight']) && !suspendKeys // 'D' or Right arrow
};
