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

    return options
        .filter(opt => opt.label.includes(query))
        .slice(0, limit)
}

function showOptions(query) {
    optionsContainer.empty()

    getOptions(query).forEach(opt => {
        optionsContainer.append(createOptionElement(opt))
    });
}

function createOptionElement({ id, label }) {
    return $("<li>")
        .text(label)
        .addClass("option")
        .on("click", () => searchAsteroid(id))
}

function searchAsteroid(id) {
    optionsContainer.hide()

    // TODO: Busca na api
}