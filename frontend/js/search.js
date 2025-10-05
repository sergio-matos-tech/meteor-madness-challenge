const optionsContainer = $("#options-container")
const searchBar = $("#search")

const limit = 7

optionsContainer.hide()

searchBar.on("input", e => {
    const query = e.target.value

    if (query.length > 0) {
        optionsContainer.show()
        showOptions(query)
    } else {
        optionsContainer.hide()
    }
});

function getOptions(query) {
    const options = [
        { id: 0, label: "meteoro 1" },
        { id: 1, label: "meteoro 2"},
        { id: 2, label: "super meteoro"},
        { id: 3, label: "meteoro terrível"}
    ]

    const words = query.split(/\s+/)

    return options
        .filter(opt => words.every(word => opt.label.includes(word)))
        .slice(0, limit)
}

function showOptions(query) {
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
}

function createOptionElement({ id, label }) {
    return $("<li>")
        .text(label)
        .addClass("option valid")
        .on("click", () => {
            optionsContainer.hide()
            asteroid.set(id)
        })
}