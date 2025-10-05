$(window).on('DOMContentLoaded', () => {

    // --- DOM ELEMENT REFERENCES ---
    const asteroidName = $("#asteroid-name")
    const massSlider = $('#mass-slider')
    const diameterSlider = $('#diameter-slider')
    const velocitySlider = $('#velocity-slider')
    const massValue = $('#mass-value')
    const diameterValue = $('#diameter-value')
    const velocityValue = $('#velocity-value')
    const energyDisplay = $('#info-energy-tnt')
    const radiusDisplay = $('#info-impact-radius')

    // --- HELPER FUNCTIONS ---
    function formatScientificNotation(num) {
        if (num === null || num === undefined) return 'N/A';
        const exponentialString = num.toExponential(1);
        const [base, exponent] = exponentialString.split('e');
        const cleanExponent = exponent.replace('+', '');
        return `${base} &times; 10<sup>${cleanExponent}</sup>`;
    }

    // --- CORE FUNCTIONS ---
    function updateDisplay() {
        // Set the mass slider to the LOGARITHM of the default mass
        massSlider.val(Math.log10(asteroid.mass))
        diameterSlider.val(asteroid.diameter)
        velocitySlider.val(asteroid.velocity)

        asteroidName.text(asteroid.name)

        massValue.html(formatScientificNotation(asteroid.mass))
        diameterValue.text(`${asteroid.diameter.toFixed(2)} km`)
        velocityValue.text(`${asteroid.velocity.toFixed(1)} km/s`)

        asteroid.calculateImpact()
        
        energyDisplay.text(asteroid.energyKilotons.toLocaleString(undefined, { maximumFractionDigits: 0 }))
        radiusDisplay.text(asteroid.craterRadius.toLocaleString(undefined, { maximumFractionDigits: 2 }))
    }
    asteroid.setUpdateDisplayFunc(updateDisplay)

    function initialize() {
        asteroid.setMass(1.5e10) // Default mass
        asteroid.setDiameter(0.4) // Default diameter
        asteroid.setVelocity(12.6) // Default velocity

        asteroid.name = "Lobotomy Asteroid"

        updateDisplay()
    }

    // --- EVENT LISTENERS (WITH LOGARITHMIC LOGIC) ---

    massSlider.on('input', (event) => {
        // The slider's value is the exponent
        const massExponent = parseFloat(event.target.value);
        const newMass = Math.pow(10, massExponent);        
        asteroid.setMass(newMass);

        updateDisplay()
    });


    diameterSlider.on('input', (event) => {
        const newDiameterKm = parseFloat(event.target.value)        
        asteroid.setDiameter(newDiameterKm)
        
        updateDisplay()
    });

    velocitySlider.on('input', (event) => {
        const newVelocity = parseFloat(event.target.value)
        asteroid.setVelocity(newVelocity)
        
        updateDisplay()
    });

    // --- START THE APP ---
    initialize()

    // --- JQUERY ENHANCEMENT ---
    $('.info').hide().fadeIn(1000)
});
