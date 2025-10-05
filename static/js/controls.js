$(window).on('DOMContentLoaded', () => {

    // --- DOM ELEMENT REFERENCES ---
    const asteroidName = $("#asteroid-name");
    const massSlider = $('#mass-slider');
    const diameterSlider = $('#diameter-slider');
    const velocitySlider = $('#velocity-slider');
    const massValue = $('#mass-value');
    const diameterValue = $('#diameter-value');
    const velocityValue = $('#velocity-value');
    const energyDisplay = $('#info-energy-tnt');
    const radiusDisplay = $('#info-impact-radius');

    // --- MITIGATION PANEL REFERENCES ---
    const mitigationBtn = $('#mitigation-toggle-btn');
    const mitigationInputs = $('#mitigation-inputs');
    const mitigationResults = $('#mitigation-results');
    const impactorMassSlider = $('#impactor-mass-slider');
    const impactorMassValue = $('#impactor-mass-value');
    const impactorVelocitySlider = $('#impactor-velocity-slider');
    const impactorVelocityValue = $('#impactor-velocity-value');
    const deltaVDisplay = $('#info-delta-v');

    // --- HELPER FUNCTIONS ---
    function formatScientificNotation(num) {
        if (num === null || num === undefined) return 'N/A';
        const exponentialString = num.toExponential(1);
        const [base, exponent] = exponentialString.split('e');
        const cleanExponent = exponent.replace('+', '');
        return `${base} &times; 10<sup>${cleanExponent}</sup>`;
    }

    // --- NOVA FUNÇÃO PARA CALCULAR E MOSTRAR O DELTA-V ---
    function calculateAndShowDeltaV() {
        // Se o painel de mitigação não estiver visível, não faz nada
        if (mitigationInputs.is(':hidden')) {
            mitigationResults.slideUp();
            return;
        }

        // 1. Pega a massa atual do asteroide do objeto 'asteroid'
        const asteroidMass = asteroid.mass;

        // 2. Pega os valores dos sliders do impactor
        const impactorMass = Math.pow(10, parseFloat(impactorMassSlider.val()));
        const impactorVelocityKms = parseFloat(impactorVelocitySlider.val());
        const impactorVelocityMs = impactorVelocityKms * 1000; // Converte para m/s

        // 3. Calcula o delta-v
        if (asteroidMass > 0) {
            const deltaV = (impactorMass * impactorVelocityMs) / (asteroidMass * 1000);
            
            // 4. Mostra o resultado na tela (em mm/s para ser mais legível)
            deltaVDisplay.text(`-${deltaV.toFixed(4)} km/s`);
            mitigationResults.slideDown();

            asteroid.setMitigatedVelocity(deltaV)
        }
    }

    // --- CORE FUNCTIONS ---
    function updateDisplay() {
        // Sempre que o display principal atualizar, também tentamos atualizar o delta-v
        calculateAndShowDeltaV();

        asteroid.calculateImpact()

        massSlider.val(Math.log10(asteroid.mass));
        diameterSlider.val(asteroid.diameter);
        velocitySlider.val(asteroid.velocity);
        asteroidName.text(asteroid.name);
        massValue.html(formatScientificNotation(asteroid.mass));
        diameterValue.text(`${asteroid.diameter.toFixed(2)} km`);
        velocityValue.text(`${asteroid.velocity.toFixed(1)} km/s`);
                
        energyDisplay.text(asteroid.energyKilotons.toLocaleString(undefined, { maximumFractionDigits: 0 }));
        radiusDisplay.text(asteroid.craterRadius.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    }
    asteroid.setUpdateDisplayFunc(updateDisplay);

    function initialize() {
        asteroid.setMass(1.5e10) // Default mass
        asteroid.setDiameter(0.4) // Default diameter
        asteroid.setVelocity(5.6) // Default velocity

        asteroid.name = "Lobotomy Asteroid"
        
        updateDisplay()
    }

    // --- ASTEROID SLIDER LISTENERS ---
    massSlider.on('input', (event) => {
        const massExponent = parseFloat(event.target.value);
        asteroid.setMass(Math.pow(10, massExponent));
        updateDisplay();
    });

    diameterSlider.on('input', (event) => {
        asteroid.setDiameter(parseFloat(event.target.value));
        updateDisplay();
    });

    velocitySlider.on('input', (event) => {
        asteroid.setVelocity(parseFloat(event.target.value));
        updateDisplay();
    });

    // --- MITIGATION PANEL LISTENERS ---
    mitigationBtn.on('click', () => {
        mitigationInputs.slideToggle(400, () => {
            // Após a animação de mostrar/esconder, calcula o delta-v
            updateDisplay();
        });

        impactorMassSlider.val(9)
        impactorMassSlider.trigger("input")

        impactorVelocitySlider.val(1)
        impactorVelocitySlider.trigger("input")
    });

    impactorMassSlider.on('input', (event) => {
        const massExponent = parseFloat(event.target.value)
        const massValue = Math.pow(10, massExponent)
        impactorMassValue.html(formatScientificNotation(massValue))
        updateDisplay() // Recalcula ao mudar a massa do impactor
    });

    impactorVelocitySlider.on('input', (event) => {
        impactorVelocityValue.text(`${parseFloat(event.target.value).toFixed(1)} km/s`);
        updateDisplay() // Recalcula ao mudar a velocidade do impactor
    });

    // --- START THE APP ---
    initialize();

    // --- JQUERY ENHANCEMENT ---
    $('.info').hide().fadeIn(1000);
});