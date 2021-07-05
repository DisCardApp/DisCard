var rakutenJson;

function getRakutenList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/resource/rakuten.json', true);
    
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            let data = JSON.parse(this.response);
            rakutenJson = data;
            // REPLACE THIS
            // document.getElementById('searchCardQuery').addEventListener('input', updateCardSearch);
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

function hideRakuten() {
    document.getElementById("cashbackSuggestionCollapse").classList.remove("show");
}

function searchStoreRakuten(name) {
    var filter;
    filter = name.toUpperCase();
    hideRakuten();
    
    const storeList = rakutenJson["stores"];
    //deletes any existing boxes 
    // let listMax = document.getElementsByTagName('li').length;
    // console.log(listMax);
    // for (i = 0; i < listMax; i++){
    //     let element = document.getElementById(i.toString());
    //     console.log(element, i.toString());
    //     element.parentNode.removeChild(element);
    // }
    
    //pulls the first 8 matches alphabetically and adds it to the suggestions box
    let suggestions = 0;
    
    for(i = 0; i < Object.keys(storeList).length; i++){
        let txtValue = storeList[Object.keys(storeList)[i]];
        let temp = txtValue['name']; 
        
        if (temp.toUpperCase().indexOf(filter) > -1) { //If temp matches the 'i'th value in storeList, create a li tag and place it inside
            // if (suggestions < 1) {
            // li.innerHTML = `<a href = ${txtValue['link']} target="_blank">` + temp + `</a>`;
            document.getElementById("cashbackSuggestionLink").innerHTML = `<a href=${txtValue['link']} target="_blank"><button type="button" class="btn btn-outline-primary quick-category-btn">Shop Now</button></a>`;
            document.getElementById("cashbackSuggestionImg").innerHTML = `<img class="img-responsive" src=${txtValue['image']} alt="Store icon">`;
            document.getElementById("cashbackSuggestionAmount").innerHTML = `${txtValue['cashback']}`;
            // document.getElementById('myUL').appendChild(li);
            suggestions++;
            //document.getElementById(boxNumber.toString()).innerHTML = temp;
            //boxNumber++;
            // }
            // else break;
            let cashbackSuggestionCollapseElement = document.getElementById("cashbackSuggestionCollapse");
            let cashbackSuggestionCollapse = new bootstrap.Collapse(
                cashbackSuggestionCollapseElement,
                { toggle: false }
            );
            cashbackSuggestionCollapse.show();
            break;
        } 
    }
}

getRakutenList();
