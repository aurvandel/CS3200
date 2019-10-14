var boyNames = [];
var favBoyNames = [];
var girlNames = [];
var favGirlNames = [];

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


// request the data from the server for the complete boy names:
fetch("http://localhost:8080/boyNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    boyNames = data;

    });
  });


function fetchFavoriteBoys () {
  fetch("http://localhost:8080/favBoyNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    favBoyNames = data;
    // add favorite boy names to list
    var favBoyList = document.querySelector("#favBoyList");
    // Clear the list if it's not empty
    var first = favBoyList.firstElementChild;
    while (first) {
      first.remove();
      first = favBoyList.firstElementChild;
    }
    var i;
    for (i = 0; i < favBoyNames.length; i++) {
      var newTopBoy = document.createElement("li");
      newTopBoy.innerHTML = favBoyNames[i].name;
      favBoyList.appendChild(newTopBoy);
    }

    });
  });
}

fetchFavoriteBoys();

// request the data from the server for the girl names:
fetch("http://localhost:8080/girlNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    girlNames = data;
    });
  });

// request the data from the server for the girl names:

function fetchFavoriteGirls () {
  fetch("http://localhost:8080/favGirlNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    favGirlNames = data;

    // populate list from file
    var favGirlLst = document.querySelector("#favGirlList");

    //clear old list
    var first = favGirlLst.firstElementChild;
    while (first) {
      first.remove();
      first = favGirlLst.firstElementChild;
    }

    var i;
    for (i = 0; i < favGirlNames.length; i++) {
      var newFavGirl = document.createElement("li");
      newFavGirl.innerHTML = favGirlNames[i].name;
      favGirlLst.appendChild(newFavGirl);
    }
    });
  });
}

fetchFavoriteGirls();

// Add a boy name to the favs list
var addBoy = document.querySelector("#addBoyName");
addBoy.onclick = function () {
  // inputField.value to get whatever was typed into field
  var newBoyInput = document.querySelector("#newBoyName");
  var newBoy = newBoyInput.value;

  var body = "name=" + encodeURIComponent(newBoy);  //encodes any special characters

  fetch("http://localhost:8080/favBoyNames", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log(body)
    // call function to do the GET request
    fetchFavoriteBoys();
  });
};

// Add a boy name to the favs list
var addGirl = document.querySelector("#addGirlName");
addGirl.onclick = function () {
  // inputField.value to get whatever was typed into field
  var newGirlInput = document.querySelector("#newGirlName");
  var newGirl = newGirlInput.value;

  var body = "name=" + encodeURIComponent(newGirl);  //encodes any special characters

  fetch("http://localhost:8080/favGirlNames", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log(body)
    // call function to do the GET request
    fetchFavoriteGirls();
  });
};

// Add a new name to the database
var submitBtn = document.querySelector("#submit");
submitBtn.onclick = function () {
  // inputField.value to get whatever was typed into field
  var newNameInput = document.querySelector("#inputName");
  var newName = newNameInput.value;

  var newGenderInputs = document.getElementsByName('inputGender');

   for(i = 0; i < newGenderInputs.length; i++) {
       if(newGenderInputs[i].checked)
       var newGender = newGenderInputs[i].value;
   }

  var newNInput = document.querySelector("#inputN");
  var newN = newNameInput.value;

  var newRankInput = document.querySelector("#inputRank");
  var newRank = newRankInput.value;

  var newOriginInput = document.querySelector("#inputOrigin");
  var newOrigin = newOriginInput.value;

  //TODO: working on getting the checkbox working
  var newFavInput = document.querySelector("#inputFav");
  var newFav = 0
  if (newFavInput.checked) {
    newFav = newFavInput.value;
  }



  var x = document.getElementById("myCheck").checked;


  //encodes any special characters
  var body = "name=" + encodeURIComponent(newName) +
  "gender=" + encodeURIComponent(newGender) +
  "n=" + encodeURIComponent(newN) +
  "rank=" + encodeURIComponent(newRank) +
  "origin=" + encodeURIComponent(newOrigin) +
  "fav=" + encodeURIComponent(newFav);

  fetch("http://localhost:8080/newName", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log(body)
    // call function to do the GET request
    fetchFavoriteGirls();
    fetchFavoriteBoys();
  });
};


// Delete from favorites list
function clickListenerDelete (initialLst) {
  document.querySelector(initialLst).addEventListener("click",function(item) {
    var tgt = item.target;
    if (tgt.tagName.toUpperCase() == "LI") {
      // TODO: remeove tgt from list and POST
      tgt.parentNode.removeChild(tgt);
    }
  });
}

clickListenerDelete("#favBoyList");
clickListenerDelete("#favGirlList");

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
      // TODO: add tgt to fav list and POST
    }
  });
}

clickListenerMove("#boyNameList", "#favBoyList");
clickListenerMove("#girlNameList", "#favGirlList");

// code for modal input form
var modalBtn = document.querySelector("#modal-btn")
var modal = document.querySelector(".modal")
var closeBtn = document.querySelector(".close-btn")
var cancelBtn = document.querySelector("#cancel")

modalBtn.onclick = function(){
  modal.style.display = "block"
}

closeBtn.onclick = function(){
  modal.style.display = "none"
}

cancelBtn.onclick = function(){
  modal.style.display = "none"
}

window.onclick = function(e){
  if(e.target == modal){
    modal.style.display = "none"
  }
}

// TODO: figure out how to make this a function
// pass list, the id of the history list, boyPick/girlPick
//function generateNameButton (namesLst, hxLst, pick) {
    //console.log(namesLst);
    //var randomName = Math.floor(Math.random() * namesLst.length);
    //pick.innerHTML = namesLst[randomName].name;

    //// Place in history list
    //var historyList = document.querySelector(hxLst);
    //var newListItem = document.createElement("li");
    //newListItem.innerHTML = namesLst[randomName].name;
    //historyList.appendChild(newListItem);
//}

//girlButton.onclick = generateNameButton (girlNames, "#girlNameList", girlPick);
