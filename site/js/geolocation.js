var placesService, searchBox;

function placeLoggerCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            console.log(results[i]);
        }
    }
}

// Initialize places
function initGeoServices() {
    const html_attribution = document.getElementById("gmapsAttributionField");
    console.log("Initializing Places service...");
    placesService = new google.maps.places.PlacesService(html_attribution);
    document.getElementById("storeGeolocateButton").addEventListener("click", locateUser);
    initSearchTextLocation();
}

function placeLocatedCallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        let result;
        console.log(results);
        for (var i = 0; i < results.length; i++) {
            if(results[i].types.includes("establishment")) {
                result = results[i];
                break;
            }
        }
        if (!result) {
            // Not an establishment here
            document.getElementById("storeGeoNotFoundContainer").innerHTML = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Unable to find a store at your location.</strong> Falling back to general category values...
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
            result = { types: [] };
        }
        evaluatePlace(result);
    }
}

function searchPosition(position) {
    const pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var placeRequest = {
        location: pos,
        radius: 5,
        type: ''
    };
    placesService.nearbySearch(placeRequest, placeLocatedCallback);
}

function locateUser(event) {
    if (event.target.hasAttribute("disabled"))
        return;
    function error() {
        alert('Unable to retrieve your location, please accept the request');
        location.reload();
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(searchPosition, error);
    } else {
        alert("Geolocation unsupported!");
    }
    // HACK: Hardcode location for dev
    // Food Basics 43.813331597239305, -79.35717205097839
    // Wimpy's 43.812764306439185, -79.35876756564207
    // Walmart 43.84206667911532, -79.4180689844961
    // searchPosition({coords:{latitude: 43.813331597239305, longitude: -79.35717205097839}});
}

function placeSearchCallback() {
    console.log("Text search callback triggered.");
    // const input = document.getElementById("storeSearchInput");
    // input.value = input.value.split(", ")[0];
    const place = searchBox.getPlace();
    evaluatePlace(place);
}

function evaluatePlace(result) {
    let placeType = "general";
    // Restaurant
    if (result.types.includes("restaurant")) {
        placeType = "restaurant";
    }
    // Grocery
    else if (result.types.includes("grocery_or_supermarket")) {
        placeType = "grocery";
    }
    // drug_store
    else if (result.types.includes("pharmacy") || result.types.includes("drugstore")) {
        placeType = "drug";
    }
    // gas
    else if (result.types.includes("gas_station")) {
        placeType = "gas";
    }
    // travel
    else if (result.types.includes("travel_agency") || result.types.includes("transit_station")) {
        placeType = "travel";
    }
    // entertainment
    else if (result.types.includes("movie_theater") || result.types.includes("night_club") || result.types.includes("tourist_attraction")) {
        placeType = "entertainment";
    }
    // bill_payments
    else if (result.types.includes("bank")) {
        placeType = "bill";
    }
    console.log(`Name: ${result.name}\nType: ${result.types[0]} (all types: ${result.types})\nEvaluated cashback type: ${placeType}`);
    recommendCardFromType(placeType);
    searchStoreRakuten(result.name || "hackyhackhackstringthatmatchesnothing");
}

function initSearchTextLocation() {
    const input = document.getElementById("storeSearchInput");
    const options = {
        fields: ["types", "icon", "name"],
        types: ["establishment"],
    };
    searchBox = new google.maps.places.Autocomplete(input, options);
    console.log("Adding autocomplete listener...")
    searchBox.addListener("place_changed", placeSearchCallback);
}
