function displayCoords(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    let range = .25/2; //approximately 80 miles lat/long - may need to tweak this
    console.log(`lat: ${latitude}, long: ${longitude}`);
    
    callAPI(latitude, longitude, range);
};
navigator.geolocation.getCurrentPosition(displayCoords);

//construct our API call and make an ajax call to USGS
//then parse the info, remove tiny little streams and display in a list for now
//for future we'll put the results on a map

//sample URL
//https://waterservices.usgs.gov/nwis/iv/?format=json&indent=on&bBox=-88.629527,42.314542,-87.129527,43.814542&siteType=ST&siteStatus=active
//&bBox=-88.629527,42.314542,-87.129527,43.814542
//West, South, East, North

//To get lat and long values subtract .75 for west, subtract .75 for south, add .75 for east and add .75 for north
function callAPI(latitude, longitude, range){
    const north = latitude + range;
    const south = latitude - range;
    const east = longitude + range;
    const west = longitude - range;

    const requestURL = `https://waterservices.usgs.gov/nwis/iv/?format=json&bBox=${west},${south},${east},${north}&siteType=ST&siteStatus=active`;
    fetch(requestURL)
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
    });
}