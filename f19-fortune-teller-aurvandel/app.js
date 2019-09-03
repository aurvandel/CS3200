// TODO: Get the entire list changed for uploading

var boyNamesURL = "https://api.myjson.com/bins/brlyf"
var girlNamesURL = "https://api.myjson.com/bins/do73b"

var boyNames = [];
var girlNames = [];

// query buttons
var boyButton = document.querySelector("#boyButton");
var girlButton = document.querySelector("#girlButton");

// query tags for placing HTML
var boyPick = document.querySelector("#boyName");
var girlPick = document.querySelector("#girlName")


boyButton.onclick = function () {
	var randomBoy = Math.floor(Math.random() * boyNames.length)
	boyPick.innerHTML = boyNames[randomBoy].name;
    
    // Place in history list
    var boyHistoryList = document.querySelector("#boyNameList");
    var newBoyListItem = document.createElement("li");
    newBoyListItem.innerHTML = boyNames[randomBoy].name;
    boyHistoryList.appendChild(newBoyListItem);
};

girlButton.onclick = function () {
	var randomGirl = Math.floor(Math.random() * girlNames.length)
	girlPick.innerHTML = girlNames[randomGirl].name;
    
    // place in history list
    var girlHistoryList = document.querySelector("#girlNameList");
    var newListItem = document.createElement("li");
    newListItem.innerHTML = girlNames[randomGirl].name;
    girlHistoryList.appendChild(newListItem);
};


// request the data from the server for the boy names:
fetch(boyNamesURL).then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    boyNames = data;
    });
  });

// request the data from the server for the boy names:
fetch(girlNamesURL).then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    girlNames = data;
    });
  });

