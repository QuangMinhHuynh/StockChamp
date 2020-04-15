var stock1Buttons = [];
var stock2Buttons = [];
var stock3Buttons = [];
var stock1;
var stock2;
var stock3;
var stock1Cell;
var stock2Cell;
var stock3Cell;

window.onload = function(){

    /*
    fetch('/api/getStock', {method: 'GET'})
    .then((resp) => resp.json())
    .then(function(data) { // success
        userData = data;
        stock1 = data[0].stock1;
        stock2 = data[0].stock2;
        stock3 = data[0].stock3;

        console.log(userData);
        buildPage();
    })
    .catch(function(error) { // error
        console.log(error);
    });*/

    var fetchResult = getStoredData();
    fetchResult.then(function(value){
        console.log(value);
        this.buildPage(value);
    });
    
};

async function getStoredData(){
    var response = await this.fetch('/api/getStock', {method: 'GET'});
    var data = await response.json();
    console.log(data);
    return data;
}

function buildPage(userData){
    //get search bar
    var searchBar = document.getElementById("searchBar");
    var searchButton = document.getElementById("searchButton");
    var submitButton = document.getElementById("updateStock");

    //process search on button click
    $(searchButton).click(function() {
        processSearch(searchBar.value, userData);
    });

    //process search on enter press in search bar
    $(searchBar).on('keypress', function(e) {
        if (e.which == 13){
            processSearch(searchBar.value, userData);
        }
    });
    
    $(submitButton).click(function() {
        console.log('submitting');
        var stringData = JSON.stringify(userData);
        console.log(`json string: ${stringData}`);

        fetch('/updateStock', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: stringData
        })
        .then(function(response) {
            console.log('recorded');
        })
        .catch(function(error) {
            console.log(error);
        });
    });
}

/**
 * Fetches search results from alphavantage api and creates table
 * @param {*} searchQuery - The search query
 */
async function processSearch(searchQuery, userData){
    
    var apiKey = "KA26ULAWH85VJQEN";
    var apiLink = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchQuery}&apikey=${apiKey}`

    var searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; //clear table for new search
    
    //append current stock results to header
    tableHeader = document.createElement('thead');
    titleCell = document.createElement('th');
    titleCell.innerHTML = `Currently Selected`;
    stock1Cell = document.createElement('th');
    stock1Cell.innerHTML = (stock1 == '') ? 'None' : stock1;
    stock2Cell = document.createElement('th');
    stock2Cell.innerHTML = (stock2 == '') ? 'None' : stock2;
    stock3Cell = document.createElement('th');
    stock3Cell.innerHTML = (stock3 == '') ? 'None' : stock3;

    tableHeader.appendChild(titleCell);
    tableHeader.appendChild(stock1Cell);
    tableHeader.appendChild(stock2Cell);
    tableHeader.appendChild(stock3Cell);

    searchResults.appendChild(tableHeader);

    //append header to table
    var tableHeader = document.createElement('thead');
    var titleCell = document.createElement('th');
    titleCell.innerHTML = `Search Results for ${searchQuery}`;
    var titleCell2 = document.createElement('th');
    titleCell2.innerHTML = "Stock 1";
    var titleCell3 = document.createElement('th');
    titleCell3.innerHTML = "Stock 2";
    var titleCell4 = document.createElement('th');
    titleCell4.innerHTML = "Stock 3";

    tableHeader.appendChild(titleCell);
    tableHeader.appendChild(titleCell2);
    tableHeader.appendChild(titleCell3);
    tableHeader.appendChild(titleCell4);

    searchResults.appendChild(tableHeader);    

    var tableBody = document.createElement('tbody');
    tableBody.id = "searchBody";
    searchResults.appendChild(tableBody);

    //fetch search results from api
    /*
    fetch(apiLink)
    .then((resp) => resp.json())
    .then(function(data) { // success
        data.bestMatches.forEach(result => {
            buildResult(result);
        });

        //set button click functions after results are complete
        setButtonFunction();
        
    })
    .catch(function(error) { // error
        console.log(error);
    });*/

    var data = await getApiData(apiLink);
    data.bestMatches.forEach(result => {
        buildResult(result);
    });

    setButtonFunction(userData);
};

async function getApiData(apiLink){
    var response = await this.fetch(apiLink);
    var data = await response.json();
    return data;
}

/**
 * Adds a row for a search result
 * @param {*} searchResult - the search result
 */
function buildResult(searchResult){
    var resultLocation = document.getElementById("searchBody");
    var resultRow = document.createElement("tr");

    //create cell with result
    var resultCell = document.createElement("td");
    resultCell.innerHTML = `${searchResult["2. name"]} (${searchResult["1. symbol"]})`;
    resultRow.appendChild(resultCell);

    //create buttons
    for (var i = 1; i < 4; i++){
        var stockButton = document.createElement('button');
        stockButton.className = "button is-info is-light";
        stockButton.innerHTML = `Set Stock ${i}`;

        if (i == 1){
            stock1Buttons.push([stockButton, searchResult["1. symbol"]]);
        }
        else if (i == 2){
            stock2Buttons.push([stockButton, searchResult["1. symbol"]]);
        }
        else if (i == 3){
            stock3Buttons.push([stockButton, searchResult["1. symbol"]]);
        }

        var newCell = document.createElement("td");
        newCell.appendChild(stockButton);

        resultRow.appendChild(newCell);

        
    }

    resultLocation.appendChild(resultRow);
};

/**
 * Applies a on click function to all stock selection buttons
 */
function setButtonFunction(userData){
    //apply click function to stock1 column
    
    stock1Buttons.forEach(button => {
        $(button[0]).click(function(){
            unhighlightButtons(stock1Buttons);
            stock1 = button[1];
            button[0].className = "button is-info";
            //console.log(`${stock1}, ${stock2}, ${stock3}`);
            stock1Cell.innerHTML = stock1
            userData['0'].stock1 = stock1;

            console.log(userData);
        });
    });

    //apply click function to stock2 column
    stock2Buttons.forEach(button => {
        $(button[0]).click(function(){
            unhighlightButtons(stock2Buttons);
            stock2 = button[1];
            button[0].className = "button is-info";
            //console.log(`${stock1}, ${stock2}, ${stock3}`);
            stock2Cell.innerHTML = stock2;
            userData['0'].stock2 = stock2;
        });
    });

    //apply click function to stock3 column
    stock3Buttons.forEach(button => {
        $(button[0]).click(function(){
            unhighlightButtons(stock3Buttons);
            stock3 = button[1];
            button[0].className = "button is-info";
            //console.log(`${stock1}, ${stock2}, ${stock3}`);
            stock3Cell.innerHTML = stock3;
            userData['0'].stock3 = stock3;
        });
    });
};

/**
 * Unhighlights buttons in a list
 * @param {*} buttons - list of buttons to unhighlight
 */
var unhighlightButtons = function(buttons){
    buttons.forEach(button => {
        button[0].className = "button is-info is-light";
    });
};