const map = L.map('map').setView([0, 0], 2)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

const mouseCoordinates = { lat: null, lng: null }

$(document).on("mousemove", (e) => {    
    let latlng = map.mouseEventToLatLng(e)
    mouseCoordinates.lat = latlng.lat
    mouseCoordinates.lng = latlng.lng
});