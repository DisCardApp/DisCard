var uid, loggedIn = false;
var setupListener = false;
var imgHandle;
const fileSelect = document.getElementById("creditCardImgPickerForm");

const fields = [
    document.getElementById("addCardFormGeneralCashback"),
    document.getElementById("addCardFormRestaurantCashback"),
    document.getElementById("addCardFormGroceryCashback"),
    document.getElementById("addCardFormDrugCashback"),
    document.getElementById("addCardFormGasCashback"),
    document.getElementById("addCardFormTravelCashback"),
    document.getElementById("addCardFormEntertainmentCashback"),
    document.getElementById("addCardFormBillCashback")
];

const extendedFields = fields + [
    document.getElementById("addCardFormName"),
    document.getElementById("creditCardImgPickerForm")
];

const addCardModal = new bootstrap.Modal(document.getElementById('addCardModal'), {
    keyboard: false
});

const searchCardModal = new bootstrap.Modal(document.getElementById('searchCardModal'), {
    keyboard: false
});

fileSelect.addEventListener("change", handleImgSelection, false);

function handleImgSelection() {
    if (this.files.length) {
        imgHandle = this.files[0];
        const img = document.getElementById("creditCardPreviewImg");
        img.onload = function() {
            URL.revokeObjectURL(this.src);
        }
        img.src = URL.createObjectURL(imgHandle);
        img.classList.remove("invisible");
        
        document.getElementById("creditCardPreviewImgPicker").classList.add("selected");
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        uid = firebase.auth().currentUser.uid;
        loggedIn = true;
        document.getElementById("userWalletSearchCard").setAttribute("data-bs-target", "#searchCardModal");
        document.getElementById("userWalletAddCard").setAttribute("data-bs-target", "#addCardModal");
        populateCards();
    }
    else {
        // User is signed out.
        loggedIn = false;
        document.getElementById("userWalletSearchCard").setAttribute("data-bs-target", "#signInPromptModal");
        document.getElementById("userWalletAddCard").setAttribute("data-bs-target", "#signInPromptModal");
    }
});

(function () {
    'use strict'
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
    .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            
            form.classList.add('was-validated')
        }, false)
    })
})()

function populateCards() {
    console.log("Populating Cards");
    let database = firebase.database();
    var creditCardsRef = database.ref("users/" + uid + "/cards");
    // creditCardsRef.once("value", (snapshot) => {
    //     snapshot.forEach((childSnapshot) => {
    //         addCardToList(childSnapshot);
    //     });
    // });
    if (!setupListener) {
        creditCardsRef.on('child_added', (data) => {
            console.log("New card added!");
            addCardToList(data);
        });
        creditCardsRef.on('child_changed', (data) => {
            console.log("Card edited!");
            editCardId(data.key, data.val());
        });
        creditCardsRef.on('child_removed', (data) => {
            let card = document.getElementById(`userWalletCardContainer${data.key}`)
            if(card != null) {
                console.log("Card removed!");
                card.remove();
            }
        });
    }
}

function deleteCardId(key) {
    let storageRef = firebase.storage().ref();
    let imgRef = storageRef.child('images/' + uid + '/' + key);
    imgRef.delete().then(() => {
        // File deleted successfully
        console.log("Deleted card image.")
    }).catch((error) => {
        // Uh-oh, an error occurred!
    });
    firebase.database().ref('users/' + uid + '/cards/' + key).remove();
    let card = document.getElementById(`userWalletCardContainer${key}`)
    if(card != null) {
        console.log("Card removed!");
        card.remove();
    }
}

function editCardId(key, cardData) {
    let editedCard = `<a class="link-unstyled" data-bs-toggle="collapse" href="#userWalletCardCollapse${key}" role="button" aria-expanded="false" aria-controls="userWalletCardCollapse${key}">
    <div id="userWalletCard${key}" class="wallet-card border border-3 position-relative has-image">
    <!-- <svg class="bi position-absolute top-50 start-50 translate-middle" width="64" height="64" fill="currentColor">
    <use xlink:href="image/bootstrap-icons.svg#credit-card-fill"/>
    </svg> -->
    <img src="${cardData.image}" class="mw-100 card-tile-img">
    <h1 class="h4 position-absolute top-50 start-50 translate-middle card-name">${cardData.name}</h1>
    </div>
    </a>
    <div data-bs-toggle="" class="collapse wallet-card-desc" id="userWalletCardCollapse${key}">
    <div class="card card-body text-start">
    <h1 class="h2">${cardData.name}</h1>
    <ul>
    <li>General Cashback: ${cardData.cashback.general}%</li>
    <li>Restaurant: ${cardData.cashback.restaurant}%</li>
    <li>Groceries: ${cardData.cashback.grocery}%</li>
    <li>Drug Stores: ${cardData.cashback.drug}%</li>
    <li>Travel: ${cardData.cashback.travel}%</li>
    <li>Entertainment: ${cardData.cashback.entertainment}%</li>
    <li>Bill Payments: ${cardData.cashback.bill}%</li>
    </ul>
    <div class="container">
    <!-- <button type="button" class="btn btn-outline-secondary float-start"><i class="bi bi-three-dots"></i></button> -->
    <button type="button" class="btn btn-outline-secondary float-start" onclick="displayEditCardModal('${key}')"><i class="bi bi-pencil-square"></i></button>
    <button type="button" class="btn btn-outline-secondary float-end" onclick="deleteCardId('${key}')"><i class="bi bi-trash"></i></button>
    </div>
    </div>
    </div>`;
    document.getElementById(`userWalletCardContainer${key}`).innerHTML = editedCard;
}

function addCardToList(data) {
    let key = data.key;
    let cardData = data.val();
    console.log(key);
    console.log(cardData);
    
    let newCard = `<div id="userWalletCardContainer${key}" class="wallet-card-container m-2">
    </div>`;
    document.getElementById("userWalletCardsFlex").innerHTML = newCard + document.getElementById("userWalletCardsFlex").innerHTML;
    editCardId(key, cardData);
}

function saveCard() {
    if(!document.getElementById("addCardForm").checkValidity())
    return;
    console.log("Saving card");
    
    var newCard = {
        name: document.getElementById("addCardFormName").value,
        cashback: {
            general:        fields[0].value,
            restaurant:     fields[1].value,
            grocery:        fields[2].value,
            drug:           fields[3].value,
            gas:            fields[4].value,
            travel:         fields[5].value,
            entertainment:  fields[6].value,
            bill:           fields[7].value
        }
    };
    
    uploadImage(imgHandle, newCard);
    
    addCardModal.hide();
    // Delete contents after 0.8s
    setTimeout((function () {discardCard()}), 0.8);
    
    return false;
}

// function writeCardToDb(cardData) {
//     var creditCardsRef = database.ref("users/" + uid + "/cards");
//     var newCreditCardRef = creditCardsRef.push();
//     newCreditCardRef.set(cardData);
// }

function uploadImage(file, cardData) {
    // Get DB refs
    let creditCardsRef = database.ref("users/" + uid + "/cards");
    let newCreditCardRef = creditCardsRef.push();
    // Upload Image
    let storageRef = firebase.storage().ref();
    let imgMetadata = {
        'contentType': file.type
    };
    
    // Push to child path.
    storageRef.child('images/' + uid + "/" + newCreditCardRef.key).put(file, imgMetadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        snapshot.ref.getDownloadURL().then(function(url) {
            console.log('File available at', url);
            cardData.image = url;
            newCreditCardRef.set(cardData);
        });
    }).catch(function(error) {
        console.error('Upload failed:', error);
    });
}

function discardCard() {
    document.getElementById("creditCardPreviewImgPicker").classList.remove("selected");
    const img = document.getElementById("creditCardPreviewImg");
    img.onload = undefined;
    img.classList.add("invisible");
    img.src = "https://via.placeholder.com/860x540";
    document.getElementById("addCardForm").classList.remove("was-validated");
    
    document.getElementById("addCardFormName").value = "";
    
    fields.forEach(element => {
        element.value = "";
    });
}

function applyGeneralToBlank() {
    const generalCashback = fields[0];
    if (generalCashback.checkValidity()) {
        fields.forEach(element => {
            if (!element.value)
            element.value = generalCashback.value;
        });
    }
}

var cardSearchList;

function populateSearchList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/resource/credit_card_info.json', true);
    
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            let data = JSON.parse(this.response);
            cardSearchList = data;
            document.getElementById('searchCardQuery').addEventListener('input', updateCardSearch);
        } else {
            // We reached our target server, but it returned an error
            console.error("Failed to get credit card search data!");
        }
    };
    
    request.onerror = function() {
        // There was a connection error of some sort
    };
    
    request.send();
}

function updateCardSearch(e) {
    let filter = e.target.value.toUpperCase();
    // deletes any existing boxes 
    document.getElementById("searchCardQueryList").innerHTML = "";
    
    //pulls the first 15 matches alphabetically and adds it to the suggestions drop down
    const maxSuggestions = 15;
    let suggestions = 0;
    
    for (var key in cardSearchList) {
        console.log(cardSearchList[key]);
        let txtValue = cardSearchList[key].bank + " " + cardSearchList[key].name; //GIVES YOU THE CARD NAME
        
        if (txtValue.toUpperCase().indexOf(filter) > -1) { //If user input matches the 'i'th value in storeList, create a li tag and place it inside
            if (suggestions < maxSuggestions) {
                const cardSuggestion = `<li class="list-group-item list-group-item-action card-search-item" onclick="selectCardFromSearch('${key}')"><img class="card-search-item-thumb me-3" src="${cardSearchList[key].image}">${cardSearchList[key].name}</li>`;
                document.getElementById("searchCardQueryList").innerHTML += cardSuggestion;
                suggestions++;
            }
            else break;
        }
    }
}

var searchSelectedKey;
function selectCardFromSearch(key) {
    document.getElementById("searchCardQueryList").innerHTML = "";
    document.getElementById("searchCardQuery").value = "";
    const newCard = cardSearchList[key];
    document.getElementById("searchCardPreviewImg").src = newCard.image;
    document.getElementById("searchCardPreviewImg").classList.remove("invisible");
    document.getElementById("searchCardFieldGeneralCashback").value = newCard.points.general + "%";
    document.getElementById("searchCardFieldRestaurantCashback").value = newCard.points.restaurant + "%";
    document.getElementById("searchCardFieldGroceryCashback").value = newCard.points.grocery + "%";
    document.getElementById("searchCardFieldDrugCashback").value = newCard.points.drug_store + "%";
    document.getElementById("searchCardFieldGasCashback").value = newCard.points.gas + "%";
    document.getElementById("searchCardFieldTravelCashback").value = newCard.points.travel + "%";
    document.getElementById("searchCardFieldEntertainmentCashback").value = newCard.points.entertainment + "%";
    document.getElementById("searchCardFieldBillCashback").value = newCard.points.bill_payments + "%";
    searchSelectedKey = key;
    document.getElementById("searchCardAddBtn").addEventListener("click", addCardToDbFromKey);
}

function addCardToDbFromKey() {
    var newCard = {
        name: cardSearchList[searchSelectedKey].name,
        cashback: {
            general:        cardSearchList[searchSelectedKey].points.general,
            restaurant:     cardSearchList[searchSelectedKey].points.restaurant,
            grocery:        cardSearchList[searchSelectedKey].points.grocery,
            drug:           cardSearchList[searchSelectedKey].points.drug_store,
            gas:            cardSearchList[searchSelectedKey].points.gas,
            travel:         cardSearchList[searchSelectedKey].points.travel,
            entertainment:  cardSearchList[searchSelectedKey].points.entertainment,
            bill:           cardSearchList[searchSelectedKey].points.bill_payments
        },
        image: cardSearchList[searchSelectedKey].image
    };
    let creditCardsRef = database.ref("users/" + uid + "/cards");
    let newCreditCardRef = creditCardsRef.push();
    newCreditCardRef.set(newCard);

    searchCardModal.hide();
    // Delete contents after 0.8s
    // setTimeout((function () {discardCard()}), 0.8);
}

populateSearchList();
