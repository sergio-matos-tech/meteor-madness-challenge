const dragableAsteroid = $("#asteroid")
let offsetX, offsetY, dragging = false
let asteroidDefaultPosition = { left: null, top: null }

dragableAsteroid.on("mousedown", (e) => {
    const pos = dragableAsteroid.position()

    asteroidDefaultPosition.left = dragableAsteroid.css("left")
    asteroidDefaultPosition.top = dragableAsteroid.css("top")
        
    offsetX = e.clientX - pos.left
    offsetY = e.clientY - pos.top
    
    dragging = true
})

$(document).on("mousemove", (e) => {
    if (!dragging) return

    dragableAsteroid.css({
        left: e.clientX - offsetX,
        top: e.clientY - offsetY
    })
})

$(document).on("mouseup", () => {
    if (!dragging) return

    resetAsteroidPosition()
    dragging = false
    asteroid.throw(mouseCoordinates)
})

function resetAsteroidPosition() {
    dragableAsteroid.css({
        left: asteroidDefaultPosition.left,
        top: asteroidDefaultPosition.top
    })
}