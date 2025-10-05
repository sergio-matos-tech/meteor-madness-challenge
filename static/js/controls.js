$(window).on('DOMContentLoaded', () => {

    // --- DOM ELEMENT REFERENCES ---
    const massSlider = $('#mass-slider');
    const diameterSlider = $('#diameter-slider');
    const velocitySlider = $('#velocity-slider');
    const massValue = $('#mass-value');
    const diameterValue = $('#diameter-value');
    const velocityValue = $('#velocity-value');
    const energyDisplay = $('#info-energy-tnt');
    const radiusDisplay = $('#info-impact-radius');

    // --- HELPER FUNCTIONS ---
    function formatScientificNotation(num) {
        if (num === null || num === undefined) return 'N/A';
        const exponentialString = num.toExponential(1);
        const [base, exponent] = exponentialString.split('e');
        const cleanExponent = exponent.replace('+', '');
        return `${base} &times; 10<sup>${cleanExponent}</sup>`;
    }

    // --- CORE FUNCTIONS ---
    function recalculateImpact() {
        asteroid.calculateImpact()
        
        energyDisplay.text(asteroid.energyKilotons.toLocaleString(undefined, { maximumFractionDigits: 0 }));
        radiusDisplay.text(asteroid.craterRadius.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    }

    function initialize() {
        const defaultAsteroid = { mass: 1.5e10, diameter: 0.4, velocity: 12.6 };

        asteroid.setMass(defaultAsteroid.mass);
        asteroid.setDiameter(defaultAsteroid.diameter);
        asteroid.setVelocity(defaultAsteroid.velocity);

        // Set the mass slider to the LOGARITHM of the default mass
        massSlider.val(Math.log10(defaultAsteroid.mass));
        diameterSlider.val(defaultAsteroid.diameter);
        velocitySlider.val(defaultAsteroid.velocity);

        massValue.html(formatScientificNotation(defaultAsteroid.mass));
        diameterValue.text(`${defaultAsteroid.diameter.toFixed(2)} km`);
        velocityValue.text(`${defaultAsteroid.velocity.toFixed(1)} km/s`);

        recalculateImpact();
    }

    // --- EVENT LISTENERS (WITH LOGARITHMIC LOGIC) ---

    massSlider.on('input', (event) => {
        // The slider's value is the exponent
        const massExponent = parseFloat(event.target.value);
        const newMass = Math.pow(10, massExponent);
        massValue.html(formatScientificNotation(newMass));
        
        asteroid.setMass(newMass);

        recalculateImpact();
    });


    diameterSlider.on('input', (event) => {
        const newDiameterKm = parseFloat(event.target.value);
        diameterValue.text(`${newDiameterKm.toFixed(2)} km`);
        
        asteroid.setDiameter(newDiameterKm)
        
        recalculateImpact();
    });

    velocitySlider.on('input', (event) => {
        const newVelocity = parseFloat(event.target.value);
        velocityValue.text(`${newVelocity.toFixed(1)} km/s`);
        
        asteroid.setVelocity(newVelocity)
        
        recalculateImpact();
    });

    // --- START THE APP ---
    initialize();

    // --- JQUERY ENHANCEMENT ---
    $('.info').hide().fadeIn(1000);
});
