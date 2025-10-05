const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const mouseCoordinates = {
    lat: null,
    lng: null
}

map.on("mousemove", function(e) {
    mouseCoordinates.lat = e.latlng.lat;
    mouseCoordinates.lng = e.latlng.lng;
});