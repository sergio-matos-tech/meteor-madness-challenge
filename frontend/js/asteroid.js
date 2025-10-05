const asteroid = {
    async load(id) {
        console.log("Asteroide selecionado:", { id })
    },
    throw({ lat, lng }) {
        // TODO: fazer isso dinâmico
        const outerRadius = 5000000;
        const innerRadius = 2500000;

        const outer = L.circle([lat, lng], {
            radius: 0,
            color: "#f5b042",
            fillColor: "#f5b042",
            fillOpacity: 0.5
        }).addTo(map)

        const inner = L.circle([lat, lng], {
            radius: 0,
            color: "#f55142",
            fillColor: "#f55142",
            fillOpacity: 0.5
        }).addTo(map)
        
        shake(20, 300)

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
    const backupStyle = {
        left: el.css("left") || 0,
        top: el.css("top") || 0
    };

    function animate(time) {
        const elapsed = time - start;
        if (elapsed >= duration) {
            el.css(backupStyle);
            return;
        }

        const dx = (Math.random() * 2 - 1) * intensity;
        const dy = (Math.random() * 2 - 1) * intensity;

        el.css({
            left: `calc(${backupStyle.left} + ${dx}px)`,
            top: `calc(${backupStyle.top} + ${dy}px)`
        });

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}