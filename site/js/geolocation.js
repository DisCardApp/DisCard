var placeType;
var placesService;

function placeLoggerCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
        }
    }
}

// Initialize and add the map
function searchLocation(position) {
    const pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    placesService = new google.maps.places.PlacesService(map);
    var placeRequest = {
        location: pos,
        radius: 5,
        type: ''
    };
    function placeSearchCallback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            let result;
            console.log(results);
            for (var i = 0; i < results.length; i++) {
                // if(results[i].types.includes("political") || results[i].types.includes("locality"))
                //   continue;
                if(results[i].types.includes("establishment")) {
                    result = results[i];
                    break;
                }
            }
            let placetype = "general";
            // Restaurant
            if (result.types.contains("restaurant")) {
                placetype = "restaurant";
            }
            // Grocery
            else if (result.types.contains("grocery_or_supermarket")) {
                placetype = "grocery";
            }
            // drug_store
            else if (result.types.contains("pharmacy") || result.types.contains("drugstore")) {
                placetype = "drug";
            }
            // gas
            else if (result.types.contains("gas_station")) {
                placetype = "gas";
            }
            // travel
            else if (result.types.contains("travel_agency") || result.types.contains("transit_station")) {
                placetype = "travel";
            }
            // entertainment
            else if (result.types.contains("movie_theater") && result.types.contains("night_club")) {
                placetype = "entertainment";
            }
            // bill_payments
            else if (result.types.contains("bank")) {
                placetype = "bill";
            }
            document.getElementById("place_info").innerHTML = `<img src="${result.icon}"><p>Name: ${result.name}<br>Type: ${result.types[0]} (all types: ${result.types})</p>`;
        }
    }
    placesService.nearbySearch(placeRequest, placeSearchCallback);
}
function locateUser() {
    function error() {
        alert('Unable to retrieve your location, please accept the request');
        location.reload();
    }
    /*
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, error);
    } else {
        alert("Geolocation unsupported!");
    }
    */
    // HACK: Hardcode location for dev
    // Food Basics 43.813331597239305, -79.35717205097839
    // Wimpy's 43.812764306439185, -79.35876756564207
    // Walmart 43.84206667911532, -79.4180689844961
    searchLocation({coords:{latitude: 43.813331597239305, longitude: -79.35717205097839}});
}