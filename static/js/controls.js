// Sliders and Value Displays
const massSlider = $("#mass-slider"), massValue = $("#mass-value");
const diameterSlider = $("#diameter-slider"), diameterValue = $("#diameter-value");
const velocitySlider = $("#velocity-slider"), velocityValue = $("#velocity-value");

// Info Panel and Title
const energyDisplay = $("#info-energy-tnt");
const craterRadiusDisplay = $("#info-impact-radius");
const asteroidNameDisplay = $("#asteroid-name");

function updateInfoPanel(state) {
    energyDisplay.text(state.energyKilotons ? state.energyKilotons.toExponential(2) : "N/A");
    craterRadiusDisplay.text(state.craterRadius ? state.craterRadius.toFixed(2) : "N/A");
}

function updateSliders(state) {
    if (state.mass) massSlider.val(Math.log10(state.mass));
    if (state.diameter) diameterSlider.val(state.diameter);
    if (state.velocity) velocitySlider.val(state.velocity);
    
    massValue.text(state.mass ? `${(state.mass / 1e9).toExponential(2)} Gt` : "N/A");
    diameterValue.text(state.diameter ? `${state.diameter.toFixed(2)} km` : "N/A");
    velocityValue.text(state.velocity ? `${state.velocity.toFixed(2)} km/s` : "N/A");
}

function updateTitle(name) {
    asteroidNameDisplay.text(name);
}

function updateUI(state) {
    updateTitle(state.name);
    updateSliders(state);
    updateInfoPanel(state);
}

// Event Listeners for Sliders
massSlider.on("input", () => {
    const actualMass = Math.pow(10, parseFloat(massSlider.val()));
    asteroid.setMass(actualMass);
    asteroid.setName("Custom Simulation");
    asteroid.calculateImpact();
    massValue.text(`${(actualMass / 1e9).toExponential(2)} Gt`);
    updateTitle(asteroid.name);
});

diameterSlider.on("input", () => {
    const diameter = parseFloat(diameterSlider.val());
    asteroid.setDiameter(diameter);
    asteroid.setName("Custom Simulation");
    asteroid.calculateImpact();
    diameterValue.text(`${diameter.toFixed(2)} km`);
    updateTitle(asteroid.name);
});

velocitySlider.on("input", () => {
    const velocity = parseFloat(velocitySlider.val());
    asteroid.setVelocity(velocity);
    asteroid.setName("Custom Simulation");
    asteroid.calculateImpact();
    velocityValue.text(`${velocity.toFixed(2)} km/s`);
    updateTitle(asteroid.name);
});