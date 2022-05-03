// TODO: figure out a button to search after map moves.
// for now use this toggle for testing so we're not sending queries every time we move the map
let initMap = true; 
let currentMarkers = [];
//
// geolocation
//
const geoOptions = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: Infinity
};

//TODO handle errors with geolocation
function geoError(err){
    console.log(err.code);
    console.log(err.message);
}

function displayUserCoords(position) {
    const user_latitude  = position.coords.latitude;
    const user_longitude = position.coords.longitude;

    //move the map to the user's location
    map.flyTo({
        center: [
            user_longitude,
            user_latitude
        ],
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
    });
    map.on('moveend', () => {
        const bounds = map.getBounds();
        getRivers(bounds);
    })
};

navigator.geolocation.getCurrentPosition(displayUserCoords, geoError, geoOptions);

//
// Get rivers from Flask
//
function getRivers(bounds) {
    const maxLat = bounds._ne.lat;
    const maxLng = bounds._ne.lng;
    const minLat = bounds._sw.lat;
    const minLng = bounds._sw.lng;

    fetch(`/locate-rivers.json?maxLat=${maxLat}&minLat=${minLat}&maxLng=${maxLng}&minLng=${minLng}`)
    .then(response => response.json())
    .then(responseData => {
        displayRivers(responseData);
    });
};

function displayRivers(rivers){
    currentMarkers.forEach((marker) => marker.remove());
    
    for (let river in rivers){        
        const marker = new mapboxgl.Marker()
        .setLngLat([rivers[river]['longitude'], rivers[river]['latitude']])
        .setPopup(new mapboxgl.Popup(
            {closeButton: false})
            .setHTML(`<a href="/river-detail/${rivers[river]['usgs_id']}">${river}</a>`)) 
        .addTo(map)
        currentMarkers.push(marker);
    }
}