import { toDegrees, toRadians } from "../utils/math.js";

export function loadAttributes(object) {
    const attributesSection = document.getElementById('selected-attributes-section');
    attributesSection.hidden = false;
    
    // x position
    const xLabel = document.createElement('label');
    xLabel.htmlFor = 'selected-x-text-input';
    xLabel.textContent = 'x:';
    attributesSection.appendChild(xLabel);
    const xText = document.createElement('input');
    xText.id = 'selected-x-text-input';
    xText.value = Number(object.position.x).toFixed();
    xText.addEventListener('change', function () { object.position.x = Number(xText.value) });
    attributesSection.appendChild(xText);

    // y position
    const yLabel = document.createElement('label');
    yLabel.htmlFor = 'selected-y-text-input';
    yLabel.textContent = 'y:';
    attributesSection.appendChild(yLabel);
    const yText = document.createElement('input');
    yText.id = 'selected-y-text-input';
    yText.value = Number(object.position.y).toFixed();
    yText.addEventListener('change', function () { object.position.y = Number(yText.value) });
    attributesSection.appendChild(yText);

    // rotation
    const rotationLabel = document.createElement('label');
    rotationLabel.htmlFor = 'selected-rotation-text-input';
    rotationLabel.textContent = 'rotation:';
    attributesSection.appendChild(rotationLabel);
    const rotationText = document.createElement('input');
    rotationText.id = 'selected-rotation-text-input';
    rotationText.value = toDegrees(Number(object.rotation)).toFixed();
    rotationText.addEventListener('change', function () { object.rotation = toRadians(Number(rotationText.value)) });
    attributesSection.appendChild(rotationText);

    if (object.shape == 'rect') {
        // width
        const widthLabel = document.createElement('label');
        widthLabel.htmlFor = 'selected-width-text-input';
        widthLabel.textContent = 'width:';
        attributesSection.appendChild(widthLabel);
        const widthText = document.createElement('input');
        widthText.id = 'selected-width-text-input';
        widthText.value = Number(object.width).toFixed();
        widthText.addEventListener('change', function () { object.width = Number(widthText.value) });
        attributesSection.appendChild(widthText);

        // height
        const heightLabel = document.createElement('label');
        heightLabel.htmlFor = 'selected-height-text-input';
        heightLabel.textContent = 'height:';
        attributesSection.appendChild(heightLabel);
        const heightText = document.createElement('input');
        heightText.id = 'selected-height-text-input';
        heightText.value = Number(object.height).toFixed();
        heightText.addEventListener('change', function () { object.height = Number(heightText.value) });
        attributesSection.appendChild(heightText);
    }

    else if (object.shape == 'circle') {
        // radius
        const radiusLabel = document.createElement('label');
        radiusLabel.htmlFor = 'selected-radius-text-input';
        radiusLabel.textContent = 'radius:';
        attributesSection.appendChild(radiusLabel);
        const radiusText = document.createElement('input');
        radiusText.id = 'selected-radius-text-input';
        radiusText.value = Number(object.radius).toFixed();
        radiusText.addEventListener('change', function () { object.radius = Number(radiusText.value) });
        attributesSection.appendChild(radiusText);
    }

    // friction
    const frictionLabel = document.createElement('label');
    frictionLabel.htmlFor = 'selected-friction-text-input';
    frictionLabel.textContent = 'friction:';
    attributesSection.appendChild(frictionLabel);
    const frictionText = document.createElement('input');
    frictionText.id = 'selected-friction-text-input';
    frictionText.value = Number(object.friction).toFixed(2);
    frictionText.addEventListener('change', function () { object.friction = Number(frictionText.value) });
    attributesSection.appendChild(frictionText);

    // mass
    const massLabel = document.createElement('label');
    massLabel.hidden = !object.isDynamic;
    massLabel.id = 'selected-mass-label';
    massLabel.htmlFor = 'selected-mass-text-input';
    massLabel.textContent = 'mass:';
    attributesSection.appendChild(massLabel);
    const massText = document.createElement('input');
    massText.hidden = !object.isDynamic;
    massText.id = 'selected-mass-text-input';
    massText.value = Number(object.mass).toFixed();
    massText.addEventListener('change', function () { object.mass = Number(massText.value) });
    attributesSection.appendChild(massText);

    // is dynamic
    const dynamicLabel = document.createElement('label');
    dynamicLabel.htmlFor = 'selected-dynamic-checkbox-input';
    dynamicLabel.textContent = 'dynamic';
    attributesSection.appendChild(dynamicLabel);
    const dynamicCheckbox = document.createElement('input');
    dynamicCheckbox.type = 'checkbox';
    dynamicCheckbox.id = 'selected-dynamic-checkbox-input';
    dynamicCheckbox.checked = object.isDynamic;
    dynamicCheckbox.addEventListener('change', function () {
        object.isDynamic = dynamicCheckbox.checked;
        object.calculateAttributes();
        updateAttributes(object);
    });
    attributesSection.appendChild(dynamicCheckbox);

    // is rotatable
    const rotatableLabel = document.createElement('label');
    rotatableLabel.hidden = !object.isDynamic;
    rotatableLabel.id = 'selected-rotatable-label';
    rotatableLabel.htmlFor = 'selected-rotatable-checkbox-input';
    rotatableLabel.textContent = 'rotatable';
    attributesSection.appendChild(rotatableLabel);
    const rotatableCheckbox = document.createElement('input');
    rotatableCheckbox.hidden = !object.isDynamic;
    rotatableCheckbox.type = 'checkbox';
    rotatableCheckbox.id = 'selected-rotatable-checkbox-input';
    rotatableCheckbox.checked = object.rotatable;
    rotatableCheckbox.addEventListener('change', function () {
        object.rotatable = rotatableCheckbox.checked;
        object.calculateAttributes();
        object.angularVelocity = 0;
    });
    attributesSection.appendChild(rotatableCheckbox);

    // color
    const colorLabel = document.createElement('label');
    colorLabel.htmlFor = 'selected-color';
    colorLabel.textContent = 'color:';
    attributesSection.appendChild(colorLabel);
    const colorPick = document.createElement('input');
    colorPick.type = 'color';
    colorPick.id = 'selected-color';
    colorPick.value = object.color;
    colorPick.addEventListener('change', function () {
        object.color = colorPick.value;
    });
    attributesSection.appendChild(colorPick);
}

export function removeAttributes() {
    const attributesSection = document.getElementById('selected-attributes-section');
    attributesSection.innerHTML = '';
    attributesSection.hidden = true;
}

export function updateAttributes(object) {
    const xText = document.getElementById('selected-x-text-input');
    xText.value = object.position.x.toFixed();

    const yText = document.getElementById('selected-y-text-input');
    yText.value = object.position.y.toFixed();

    const rotationText = document.getElementById('selected-rotation-text-input');
    rotationText.value = toDegrees(object.rotation).toFixed();

    if (object.shape == 'rect') {
        const widthText = document.getElementById('selected-width-text-input');
        widthText.value = object.width.toFixed();

        const heightText = document.getElementById('selected-height-text-input');
        heightText.value = object.height.toFixed();
    }

    else if (object.shape == 'circle') {
        const radiusText = document.getElementById('selected-radius-text-input');
        radiusText.value = object.radius.toFixed();
    }

    const rotatableLabel = document.getElementById('selected-rotatable-label');
    const rotatableCheckbox = document.getElementById('selected-rotatable-checkbox-input');
    rotatableLabel.hidden = !object.isDynamic;
    rotatableCheckbox.hidden = !object.isDynamic;

    const massLabel = document.getElementById('selected-mass-label');
    const massText = document.getElementById('selected-mass-text-input');
    massLabel.hidden = !object.isDynamic;
    massText.hidden = !object.isDynamic;
    massText.value = object.mass;
}