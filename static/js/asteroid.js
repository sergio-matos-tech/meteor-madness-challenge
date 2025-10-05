const asteroid = {
    name: "Custom Simulation",
    mass: null,
    diameter: null,
    velocity: null,
    energyKilotons: null,
    craterRadius: null,

    init() {
        this.setMass(Math.pow(10, 12));
        this.setDiameter(1.0);
        this.setVelocity(20);
        this.calculateImpact();
    },

    setMass(mass) { this.mass = mass; },
    setDiameter(diameter) { this.diameter = diameter; },
    setVelocity(velocity) { this.velocity = velocity; },
    setName(name) { this.name = name; },

    calculateImpact() {
        if (!this.mass || !this.velocity) return;
        const kineticEnergyJoules = 0.5 * this.mass * Math.pow(this.velocity * 1000, 2);
        this.energyKilotons = kineticEnergyJoules / 4.184e12;
        this.craterRadius = 0.1 * Math.pow(this.energyKilotons, 1/3);
        updateInfoPanel(this);
    },

    async load(id, onLoad = null) {
        let apiUrl = `/api/v1/asteroids/${id}`;
        if (id === 'historical_chicxulub') {
            apiUrl = `/api/v1/asteroids/historical/chicxulub`;
        }

        $.ajax({
            url: apiUrl,
            type: "GET",
            success: (data) => {
                this.setName(data.name);

                if (id === 'historical_chicxulub') {
                    const avgDiameter = (data.estimated_diameter_km.min + data.estimated_diameter_km.max) / 2;
                    this.setDiameter(avgDiameter);
                    this.setVelocity(parseFloat(data.relative_velocity_km_s));
                    this.setMass(parseFloat(data.estimated_mass_kg));
                } else {
                    const diameter = (data.estimated_diameter.kilometers.estimated_diameter_min + data.estimated_diameter.kilometers.estimated_diameter_max) / 2;
                    const velocity = parseFloat(data.close_approach_data[0].relative_velocity.kilometers_per_second);
                    const mass = 1.3e12 * Math.pow(diameter, 3); // Mass approximation
                    this.setDiameter(diameter);
                    this.setVelocity(velocity);
                    this.setMass(mass);
                }
                
                this.calculateImpact();
                updateUI(this);
            },
            error: (xhr, status, error) => console.error(`Failed to load data for ${id}:`, error),
            complete: () => onLoad?.()
        });
    },

    throw({ lat, lng }) {
        if (!this.craterRadius) return;
        const radiusMeters = this.craterRadius * 1000;
        const outer = L.circle([lat, lng], { radius: 0, color: "#f5b042", fillColor: "#f5b042", fillOpacity: 0.5 }).addTo(map);
        const inner = L.circle([lat, lng], { radius: 0, color: "#f55142", fillColor: "#f55142", fillOpacity: 0.5 }).addTo(map);
        
        shake(20, 300);

        let currentStep = 0;
        const grow = setInterval(() => {
            currentStep++;
            outer.setRadius((currentStep / 60) * radiusMeters * 2);
            inner.setRadius((currentStep / 60) * radiusMeters);
            if (currentStep >= 60) clearInterval(grow);
        }, 5);
    }
};

function shake(intensity, duration) {
    const el = $("#map");
    const start = performance.now();
    const backupStyle = { left: el.css("left") || "0px", top: el.css("top") || "0px" };

    function animate(time) {
        const elapsed = time - start;
        if (elapsed >= duration) {
            el.css(backupStyle);
            return;
        }
        const dx = (Math.random() - 0.5) * intensity;
        const dy = (Math.random() - 0.5) * intensity;
        el.css({ left: `calc(${backupStyle.left} + ${dx}px)`, top: `calc(${backupStyle.top} + ${dy}px)` });
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// Initialize the asteroid object on page load
$(document).ready(() => {
    asteroid.init();
    updateUI(asteroid);
});