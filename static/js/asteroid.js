const asteroid = {
    name: "",
    mass: null,
    diameter: null,
    velocity: null,

    energyKilotons: null,
    craterRadius: null,
    overpressureRaius: null,

    updateDisplayFunc: null,

    setUpdateDisplayFunc(func) {
        this.updateDisplayFunc = func
    },

    setMass(mass) {
        this.mass = mass
        this.calculateImpact()
    },

    setDiameter(diameter) {
        this.diameter = diameter
        this.calculateImpact()
    },

    setVelocity(velocity) {
        this.velocity = velocity
        this.calculateImpact()
    },

    calculateImpact() {
        const kineticEnergyJoules = 0.5 * this.mass * Math.pow(this.velocity * 1000, 2);
        const JOULES_PER_KILOTON = 4.184e12;
        
        this.energyKilotons = kineticEnergyJoules / JOULES_PER_KILOTON;
        this.craterRadius = 1.8 * Math.pow(this.energyKilotons / 1000, 1/3.4) * 1000 / 2;

        this.overpressureRaius = findOverpressureRadius(this.energyKilotons, 4.0)
    },

    async load(id, onLoad = null) {
        $.ajax({
            url: `/api/v1/asteroid?asteroid_id=${id}`,
            type: "GET",
            dataType: "json",
            success: response => {
                console.log(response)
                this.name = response.name
                this.diameter = (response.diameter_max + response.diameter_min) / 2
                this.velocity = response.velocity_kms
                this.mass = response.mass
                
                this.calculateImpact()

                this.updateDisplayFunc()
            },
            error: (xhr, status, error) => console.error(status, error),
            complete: () => onLoad?.()
        });
    },
    
    throw({ lat, lng }) {
        const innerRadius = this.craterRadius;
        const outerRadius = this.overpressureRaius;

        const outer = L.circle([lat, lng], {
            radius: 0,
            color: "#f2cb2c",
            fillColor: "#f2cb2c",
            fillOpacity: 0.5
        }).addTo(map)

        const inner = L.circle([lat, lng], {
            radius: 0,
            color: "#f55142",
            fillColor: "#f55142",
            fillOpacity: 0.5
        }).addTo(map)
        
        shake(20, 400)

        /* ---------- Crescimento gradativo ---------- */
        const growDuration = 200
        const growSteps = 60
        let currentStep = 0
        
        const grow = setInterval(() => {
            currentStep++

            outer.setRadius((currentStep / growSteps) * outerRadius)
            inner.setRadius((currentStep / growSteps) * innerRadius)

            if (currentStep >= growSteps) {
                clearInterval(grow)
            }
        }, growDuration / growSteps)
    }
}

function shake(intensity, duration) {
    const el = $("#map")    
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        if (elapsed >= duration) {
            el.css({ left: 0, top: 0 });
            return;
        }

        const dx = (Math.random() * 2 - 1) * intensity;
        const dy = (Math.random() * 2 - 1) * intensity;

        el.css({ left: dx, top: dy });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function findOverpressureRadius(energyKilotons, targetPsi) {
    if (energyKilotons <= 0) return 0.0
        
    const targetPa = targetPsi * 6894.76

    let distanceKm = 0.1  /* Start with a small estimate */
    let stepKm = 1.0     /* Initial step size */
    
    while (calculateOverpressureAtDistance(energyKilotons, distanceKm) > targetPa) {
        distanceKm += stepKm
        
        // Increase step size for faster search with large energies
        if (distanceKm > 100) stepKm = 10
        if (distanceKm > 1000) stepKm = 50
    }
    
    // # Fine search: go back one step and refine with smaller steps
    distanceKm -= stepKm
    stepKm = Math.max(0.1, stepKm / 10) /* Ensure step is not zero */
    while (calculateOverpressureAtDistance(energyKilotons, distanceKm) > targetPa) {
        distanceKm += stepKm
    }

    return distanceKm * 1000
}

function calculateOverpressureAtDistance(energyKilotons, distanceKm) {
    if (energyKilotons <= 0 || distanceKm <= 0) return 0.0

    const distanceM = distanceKm * 1000
    scaledDistanceR1 = distanceM / Math.pow(energyKilotons, (1/3))

    const p_x = 75000  /* Pascals */
    const r_x = 290    /* meters */

    if (scaledDistanceR1 == 0) return Infinity
    
    return (p_x * r_x) / (4 * scaledDistanceR1) * (1 + 3 * Math.pow(r_x / scaledDistanceR1, 1/3))
}