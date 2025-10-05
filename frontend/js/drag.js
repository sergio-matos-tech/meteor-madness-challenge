const dragableAsteroid = $("#asteroid")
let offsetX, offsetY, dragging = false
let asteroidDefaultPosition = { left: null, top: null }

dragableAsteroid.on("mousedown", (e) => {
    dragging = true

    const pos = dragableAsteroid.position()

    asteroidDefaultPosition.left = pos.left
    asteroidDefaultPosition.top = pos.top
    
    offsetX = e.clientX - pos.left
    offsetY = e.clientY - pos.top
})

$(document).on("mousemove", (e) => {
    if (dragging) {
        dragableAsteroid.css({
            left: e.clientX - offsetX,
            top: e.clientY - offsetY
        })
    }
})

$(document).on("mouseup", () => {
    if (dragging) {
        resetAsteroidPosition()
        dragging = false
        throwAsteroid(mouseCoordinates)
    }
})

function resetAsteroidPosition() {
    dragableAsteroid.css({
        left: asteroidDefaultPosition.left,
        top: asteroidDefaultPosition.top
    })
}