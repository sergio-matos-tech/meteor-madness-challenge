const asteroid = {
    async load(id) {
        console.log("Asteroide selecionado:", { id })
    },
    throw({ lat, lng }) {    
        L.circle([lat, lng], {
            radius: 800,
            color: "#f5b042",
            fillColor: "#f5b042",
            fillOpacity: 0.5
        }).addTo(map)

        L.circle([lat, lng], {
            radius: 500,
            color: "#f55142",
            fillColor: "#f55142",
            fillOpacity: 0.5
        }).addTo(map)
    }
}