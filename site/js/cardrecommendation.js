var loggedIn = false, uid;

const categoryFriendlyNames = {
    bill: "Bill Payments",
    drug: "Pharmacies",
    entertainment: "Entertainment",
    gas: "Gas Stations",
    general: "General",
    grocery: "Grocery",
    restaurant: "Restaurant",
    travel: "Travel"
};

const quickCategoryButtons = document.getElementsByClassName("quick-category-btn");

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        loggedIn = true;
        uid = firebase.auth().currentUser.uid;
        document.getElementById("storeSearchInput").removeAttribute("disabled");
        document.getElementById("storeGeolocateButton").removeAttribute("disabled");
        for (let element of quickCategoryButtons) {
            element.removeAttribute("disabled");
            element.setAttribute("onclick", element.getAttribute("onclick-placeholder"));
        }
    }
    else {
        // User is signed out.
        loggedIn = false;
        document.getElementById("storeSearchInput").setAttribute("disabled", "");
        document.getElementById("storeGeolocateButton").setAttribute("disabled", "");
        for (let element of quickCategoryButtons) {
            element.setAttribute("disabled", "");
            element.removeAttribute("onclick");
        }
    }
});

function recommendCardFromType(placeType) {
    if (!loggedIn)
        return;
    for (let element of quickCategoryButtons) {
        if (element.classList.contains("btn-secondary")) {
            element.classList.add("btn-outline-secondary");
            element.classList.remove("btn-secondary");
        }
    }
    if(event && event.srcElement) {
        event.srcElement.classList.add("btn-secondary");
        event.srcElement.classList.remove("btn-outline-secondary");
    }
    let database = firebase.database();
    var creditCardsRef = database.ref("users/" + uid + "/cards");
    creditCardsRef.once("value", (snapshot) => {
        let cardSuggestions = {
            selectedType: placeType,
            highestCashBackCard: {
                name: null,
                cashback: {
                    bill: -1,
                    drug: -1,
                    entertainment: -1,
                    gas: -1,
                    general: -1,
                    grocery: -1,
                    restaurant: -1,
                    travel: -1
                }
            },
            secondCashbackCard: {
                name: null,
                cashback: {
                    bill: -1,
                    drug: -1,
                    entertainment: -1,
                    gas: -1,
                    general: -1,
                    grocery: -1,
                    restaurant: -1,
                    travel: -1
                }
            }
        };
        snapshot.forEach((childSnapshot) => {
            let checkCard = childSnapshot.val();
            switch(placeType) {
                case "bill":
                    if (checkCard.cashback.bill > cardSuggestions.highestCashBackCard.cashback.bill) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.bill > cardSuggestions.secondCashbackCard.cashback.bill) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
                case "drug":
                    if (checkCard.cashback.drug > cardSuggestions.highestCashBackCard.cashback.drug) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.drug > cardSuggestions.secondCashbackCard.cashback.drug) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
                case "entertainment":
                    if (checkCard.cashback.entertainment > cardSuggestions.highestCashBackCard.cashback.entertainment) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.entertainment > cardSuggestions.secondCashbackCard.cashback.entertainment) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
                case "gas":
                    if (checkCard.cashback.gas > cardSuggestions.highestCashBackCard.cashback.gas) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.gas > cardSuggestions.secondCashbackCard.cashback.gas) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
                case "grocery":
                    if (checkCard.cashback.grocery > cardSuggestions.highestCashBackCard.cashback.grocery) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.grocery > cardSuggestions.secondCashbackCard.cashback.grocery) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
                case "restaurant":
                    if (checkCard.cashback.restaurant > cardSuggestions.highestCashBackCard.cashback.restaurant) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.restaurant > cardSuggestions.secondCashbackCard.cashback.restaurant) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
                case "travel":
                    if (checkCard.cashback.travel > cardSuggestions.highestCashBackCard.cashback.travel) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.travel > cardSuggestions.secondCashbackCard.cashback.travel) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
                default:
                    // General
                    cardSuggestions.selectedType = "general";
                    if (checkCard.cashback.general > cardSuggestions.highestCashBackCard.cashback.general) {
                        cardSuggestions.secondCashbackCard = cardSuggestions.highestCashBackCard;
                        cardSuggestions.highestCashBackCard = checkCard;
                    }
                    else if (checkCard.cashback.general > cardSuggestions.secondCashbackCard.cashback.general) {
                        cardSuggestions.secondCashbackCard = checkCard;
                    }
                    break;
            }
        });
        console.log("Suggestions for " + placeType);
        console.log(cardSuggestions);
        if(cardSuggestions.highestCashBackCard.name)
            displayCardSuggestions(cardSuggestions)
        else {
            document.getElementById("suggestionNoCardsContainer").innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>No cards in your wallet!</strong> We can't give you suggestions without any cards. Head over to the wallet page and add some now!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        }
    });
}

function displayCardSuggestions(cardSuggestions) {
    if (!cardSuggestions.highestCashBackCard.name)
        return;
    document.getElementById("bestCardImgCollapse").classList.remove("show");
    document.getElementById("bestCardDescCollapse").classList.remove("show");
    document.getElementById("bestCardDescName").innerHTML = cardSuggestions.highestCashBackCard.name;
    document.getElementById("creditCardPreviewImg").onload = function(e) {
        let bestCardImgCollapseElement = document.getElementById("bestCardImgCollapse");
        let bestCardImgCollapse = new bootstrap.Collapse(
            bestCardImgCollapseElement,
            { toggle: false }
            );
            bestCardImgCollapse.show();
        };
        document.getElementById("creditCardPreviewImg").src = cardSuggestions.highestCashBackCard.image;
        let rewardType = "Cashback";
        // if (cardSuggestions.highestCashBackCard.type is points)
        // rewardType = "Points Value Back"
        document.getElementById("bestCardDescCashback").innerHTML = `${categoryFriendlyNames[cardSuggestions.selectedType]} • ${cardSuggestions.highestCashBackCard.cashback[cardSuggestions.selectedType]}% ${rewardType}`;
        
        if (cardSuggestions.secondCashbackCard.name) {
            // 2nd option valid
            document.getElementById("secondCardBody").classList.remove("d-none");
            document.getElementById("secondCardDescName").innerHTML = "Alternate Suggestion: " + cardSuggestions.secondCashbackCard.name;
            // document.getElementById("creditCardPreviewImg2").onload = function(e) {
            //     let bestCardImgCollapseElement = document.getElementById("bestCardImgCollapse");
            //     let bestCardImgCollapse = new bootstrap.Collapse(
            //         bestCardImgCollapseElement,
            //         { toggle: false }
            //     );
            //     bestCardImgCollapse.show();
            // };
            document.getElementById("creditCardPreviewImg2").src = cardSuggestions.secondCashbackCard.image;
            let rewardType2 = "Cashback";
            // if (cardSuggestions.secondCashbackCard.type is points)
            // rewardType = "Points Value Back"
            document.getElementById("secondCardDescCashback").innerHTML = `${categoryFriendlyNames[cardSuggestions.selectedType]} • ${cardSuggestions.secondCashbackCard.cashback[cardSuggestions.selectedType]}% ${rewardType2}`;
        }
        else {
            // 2nd option invalid
            document.getElementById("secondCardBody").classList.add("d-none");
        }
    }
    