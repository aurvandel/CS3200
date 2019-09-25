var boyNames = [];
var girlNames = [];

// query buttons
var boyButton = document.querySelector("#boyButton");
var girlButton = document.querySelector("#girlButton");

// query tags for placing HTML
var boyPick = document.querySelector("#boyName");
var girlPick = document.querySelector("#girlName");

// function to display names on button click
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

// TODO: turn this into a function

// request the data from the server for the boy names:
fetch("http://localhost:8080/boyNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    boyNames = data;

    // prepolulate list with top 10 names
    var favBoy = document.querySelector("#favBoyList");
    var i;
    for (i = 0; i < 10; i++) {
      var newTopBoy = document.createElement("li");
      newTopBoy.innerHTML = boyNames[i].name;
      favBoy.appendChild(newTopBoy);
    }

    });
  });

// request the data from the server for the girl names:
fetch("http://localhost:8080/girlNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    girlNames = data;

    // prepopulate list with top 10 names
    var favGirl = document.querySelector("#favGirlList");
    var i;
    for (i = 0; i < 10; i++) {
      var newTopGirl = document.createElement("li");
      newTopGirl.innerHTML = girlNames[i].name;
      favGirl.appendChild(newTopGirl);
    }
    });
  });

// TODO: get POST request to add to list

// Add a boy name to the favs list
var addBoy = document.querySelector("#addBoyName");

addBoy.onclick = function () {
  // inputField.value to get whatever was typed into field
  var newBoyInput = document.querySelector("#newBoyName");
  var newBoy = newBoyInput.value;

  var body = "name=" + encodeURIComponent(newBoy);  //encodes any special characters

  fetch("http://localhost:8080/boyNames", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log(body)
    // call function to do the GET request
  });
};

// TODO: add click listener for deleting from favs list

// function to move names from history list to favs
function clickListenerMove (initialLst, newLst) {
  document.querySelector(initialLst).addEventListener("click",function(item) {
    var tgt = item.target;
    var favLstElement = document.querySelector(newLst);
    if (tgt.tagName.toUpperCase() == "LI") {
      var newFavElement = document.createElement("li");
      newFavElement.innerHTML = tgt.innerHTML;
      favLstElement.appendChild(newFavElement);
      tgt.parentNode.removeChild(tgt);
    }
  });
}

clickListenerMove("#boyNameList", "#favBoyList");
clickListenerMove("#girlNameList", "#favGirlList");
