const asteroid = {
    set(id) {
        console.log("Asteroide selecionado:", { id })
    },
    throw({ lat, lng }) {
        console.log("Asteroide lançado:", { lat, lng })
    }
}