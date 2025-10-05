const optionsContainer = $("#options-container")
const searchBar = $("#search")

// Puxa lista de asteroids da api
let asteroidList = []


getAsteroidList().then(asteroids => {
    const exempleAsteroids = asteroids.slice(0, 3).map(a => a.name).join(", ")
    searchBar.attr("placeholder", `Ex: ${exempleAsteroids}...`);
    
    asteroidList = asteroids

    showOptions(searchBar.val())
})

const limit = 7

optionsContainer.hide()

searchBar.on("input", e => {
    const query = e.target.value
    showOptions(query)
});

function getOptions(query) {
    const words = query.toLowerCase().split(/\s+/)

    return asteroidList
        .filter(opt => {
            const name = opt.name.toLowerCase() 
            return words.every(word => name.includes(word))
        })
        .slice(0, limit)
}

function showOptions(query) {
    if (!query.length) {
        optionsContainer.hide()
        return
    }

    optionsContainer.empty()

    const options = getOptions(query)

    if (options.length) {
        options.forEach(opt => optionsContainer.append(createOptionElement(opt)))
    } else {
        const msg = $("<li>")
            .text("Ops... nenhum asteroid com esse nome encontrado")
            .addClass("option")

        optionsContainer.append(msg)
    }

    optionsContainer.show()
}

function createOptionElement({ id, name }) {
    return $("<li>")
        .text(name)
        .addClass("option valid")
        .on("click", () => {
            optionsContainer.hide()

            // Overlay para mostrar cursor de loading
            const loadingOverlay = $("<div id='cursorOverlay'></div>").css({
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vh",
                height: "100vh",
                cursor: "wait",
                zIndex: 99990
            }).appendTo("body")

            asteroid.load(id, () => loadingOverlay.remove())
        })
}

async function getAsteroidList() {
    return new Promise((resolve, reject) => {
        $.ajax({
            // TODO: Colocar url em .env
            url: "http://localhost:5000/api/v1/asteroids/names",
            dataType: "json",
            type: "GET",
            success: resolve,
            error: reject
        });
    });
}