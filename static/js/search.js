const optionsContainer = $("#options-container");
const searchBar = $("#search");

let asteroidList = [];

getAsteroidList().then(asteroids => {
    searchBar.attr("placeholder", "e.g., Chicxulub (Dinosaur Killer)");
    asteroidList = asteroids;
    showOptions(searchBar.val());
}).catch(err => {
    console.error("Error fetching asteroid list:", err);
    searchBar.attr("placeholder", "Error loading asteroids");
});

const limit = 7;
optionsContainer.hide();

searchBar.on("input", e => {
    const query = e.target.value;
    showOptions(query);
});

function getOptions(query) {
    const words = query.toLowerCase().split(/\s+/);
    return asteroidList
        .filter(opt => {
            const name = opt.name.toLowerCase();
            return words.every(word => name.includes(word));
        })
        .slice(0, limit);
}

function showOptions(query) {
    if (!query.length) {
        optionsContainer.hide();
        return;
    }
    optionsContainer.empty();
    const options = getOptions(query);
    if (options.length) {
        options.forEach(opt => optionsContainer.append(createOptionElement(opt)));
    } else {
        optionsContainer.append($("<li>").text("No asteroids found with that name").addClass("option"));
    }
    optionsContainer.show();
}

function createOptionElement({ id, name }) {
    return $("<li>")
        .text(name)
        .addClass("option valid")
        .on("click", () => {
            optionsContainer.hide();
            const loadingOverlay = $("<div id='cursorOverlay'></div>").css({
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "wait",
                zIndex: 99990
            }).appendTo("body");
            asteroid.load(id, () => loadingOverlay.remove());
        });
}

async function getAsteroidList() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://localhost:5000/api/v1/asteroids/names",
            dataType: "json",
            type: "GET",
            success: resolve,
            error: reject
        });
    });
}