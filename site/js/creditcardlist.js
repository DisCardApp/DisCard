var loggedIn = false;
const fileSelect = document.getElementById("creditCarcImgPickerForm");

fileSelect.addEventListener("change", handleFiles, false);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        loggedIn = true;
        let database = firebase.database();
        var creditCardsRef = database.ref("users/" + user.uid + "/cards");
        creditCardsRef.on("value", function (snapshot) {
            const data = snapshot.val();
            if (data == null) {
                console.log(data);
            }
        });
    }
    else {
        // User is signed out.
        loggedIn = false;
    }
});

function saveCard() {
    ;
}