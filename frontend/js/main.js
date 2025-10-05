window.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENT REFERENCES ---
    const massSlider = document.getElementById('mass-slider');
    const diameterSlider = document.getElementById('diameter-slider');
    const velocitySlider = document.getElementById('velocity-slider');
    const massValue = document.getElementById('mass-value');
    const diameterValue = document.getElementById('diameter-value');
    const velocityValue = document.getElementById('velocity-value');
    const energyDisplay = document.getElementById('info-energy-tnt');
    const radiusDisplay = document.getElementById('info-impact-radius');

    // --- CONSTANTS ---
    const ASTEROID_DENSITY = 2700; // kg/m^3 (Density of rock)

    
    // --- HELPER FUNCTIONS ---
    function formatScientificNotation(num) {
        if (num === null || num === undefined) return 'N/A';
        const exponentialString = num.toExponential(1);
        const [base, exponent] = exponentialString.split('e');
        const cleanExponent = exponent.replace('+', '');
        return `${base} &times; 10<sup>${cleanExponent}</sup>`;
    }

    // --- SIMULATION STATE ---
    const simulationState = {
        mass: 0,
        diameter: 0,
        velocity: 0
    };

    // --- CORE FUNCTIONS ---
    function recalculateImpact() {
        const { mass, velocity } = simulationState;
        const kineticEnergyJoules = 0.5 * mass * Math.pow(velocity * 1000, 2);
        const energyKilotons = kineticEnergyJoules / 4.184e12;
        const craterRadius = 0.1 * Math.pow(energyKilotons, 1/3);

        energyDisplay.textContent = energyKilotons.toLocaleString(undefined, { maximumFractionDigits: 0 });
        radiusDisplay.textContent = craterRadius.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }

    function initialize() {
        const defaultAsteroid = { mass: 1.5e10, diameter: 0.4, velocity: 12.6 };
        simulationState.mass = defaultAsteroid.mass;
        simulationState.diameter = defaultAsteroid.diameter;
        simulationState.velocity = defaultAsteroid.velocity;

        // Set the mass slider to the LOGARITHM of the default mass
        massSlider.value = Math.log10(defaultAsteroid.mass);
        diameterSlider.value = defaultAsteroid.diameter;
        velocitySlider.value = defaultAsteroid.velocity;

        massValue.innerHTML = formatScientificNotation(defaultAsteroid.mass);
        diameterValue.textContent = `${defaultAsteroid.diameter.toFixed(2)} km`;
        velocityValue.textContent = `${defaultAsteroid.velocity.toFixed(1)} km/s`;

        recalculateImpact();
    }

    // --- EVENT LISTENERS (WITH LOGARITHMIC LOGIC) ---


    massSlider.addEventListener('input', (event) => {
        // The slider's value is the exponent
        const massExponent = parseFloat(event.target.value);
        const newMass = Math.pow(10, massExponent);
        simulationState.mass = newMass;
        massValue.innerHTML = formatScientificNotation(newMass);
        recalculateImpact();
    });


    diameterSlider.addEventListener('input', (event) => {
        const newDiameterKm = parseFloat(event.target.value);
        simulationState.diameter = newDiameterKm;
        diameterValue.textContent = `${newDiameterKm.toFixed(2)} km`;
        recalculateImpact();
    });

    velocitySlider.addEventListener('input', (event) => {
        const newVelocity = parseFloat(event.target.value);
        simulationState.velocity = newVelocity;
        velocityValue.textContent = `${newVelocity.toFixed(1)} km/s`;
        recalculateImpact();
    });

    // --- START THE APP ---
    initialize();

    // --- JQUERY ENHANCEMENT ---
    $('.info').hide().fadeIn(1000);
});