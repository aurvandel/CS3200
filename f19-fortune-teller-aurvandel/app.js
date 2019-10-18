//TODO: Decide on delete button placement and usage
//TODO: Fix the move on click listener (maybe this is the update method)
//TODO: Decide how I want to do an update

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

/* Maybe refactor this for another time
function fetchAll() {
  fetch("http://localhost:8080/names").then(function (response) {
    response.json().then(function (names) {
      console.log(names);
      names.forEach(function(name) {
        if (name.gender == "M") {
          if (name.fav == 1) {
            favBoyNames.push(name)
          } else {
            boyNames.push(name)
          }
        }

      });
    });
  });
}
*/

function fetchFavorites (path, favsListEl, dataModalNameEl,
  nameDataModal, nameDataDiv) {

  fetch(path).then(function (response) {
    response.json().then(function (data) {
      favNames = data;
      var favList = document.querySelector(favsListEl);
      // Clear the list if it's not empty
      var first = favList.firstElementChild;
      while (first) {
        first.remove();
        first = favList.firstElementChild;
      }
      favNames.forEach(function(favName) {
        var newTop = document.createElement("li");
        newTop.innerHTML = favName.name;
        favList.appendChild(newTop);
        newTop.addEventListener("click", function(item) {
          clearList(nameDataDiv);
          var memberPath = path + "/" + favName.id;
          fetch(memberPath).then(function(response) {
            response.json().then(function(data) {
            // put the name in h3
              document.querySelector(dataModalNameEl).innerHTML = data.name;

              var rank = document.createElement("p");
              rank.innerHTML = "Popularity: " + data.rank;
              nameDataDiv.appendChild(rank);

              var n = document.createElement("p");
              n.innerHTML = "Number: " + data.n;
              nameDataDiv.appendChild(n);

              var origin = document.createElement("p");
              origin.innerHTML = "Origin: " + data.origin;
              nameDataDiv.appendChild(origin);
          });
        });
        nameDataModal.style.visibility = "visible";
      });
      /*
      newTopBoy.addEventListener("mouseout", function(item) {
        item.target.style.color = "black";
        nameDataModal.style.visibility = "hidden";
        var child = nameDataUL.lastElementChild;
        while (child) {
          nameDataUL.removeChild(child);
          child = nameDataUL.lastElementChild;
        }
      });
  */
    })
    });
  });
}

// Get the list of favorite boy names
var boyNameDataModal = document.querySelector("#boyNameData");
var boyNameDataDiv = document.querySelector("#boyNameDataSpan");
// Get the list of favorite girl names
var girlNameDataModal = document.querySelector("#girlNameData");
var girlNameDataDiv = document.querySelector("#girlNameDataSpan");
function refreshFavorites () {
  fetchFavorites("http://localhost:8080/favBoyNames", "#favBoyList",
  "#boyNameDataName", boyNameDataModal, boyNameDataDiv);
  fetchFavorites("http://localhost:8080/favGirlNames", "#favGirlList",
  "#girlNameDataName", girlNameDataModal, girlNameDataDiv);
}

refreshFavorites();

// request the data from the server for the girl names:
fetch("http://localhost:8080/girlNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    girlNames = data;
    });
  });


// Add a boy name to the favs list
var addBoy = document.querySelector("#addBoyName");
addBoy.onclick = function () {
  // inputField.value to get whatever was typed into field
  var newBoyInput = document.querySelector("#newBoyName");
  var newBoy = newBoyInput.value;

  var body = "name=" + encodeURIComponent(newBoy) + "&" +
  "gender=" + encodeURIComponent('M') + "&" +
  "n=" + encodeURIComponent(null) + "&" +
  "rank=" + encodeURIComponent(null) + "&" +
  "origin=" + encodeURIComponent(null) + "&" +
  "fav=" + encodeURIComponent(1);

  fetch("http://localhost:8080/favBoyNames", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    // call function to do the GET request
    fetchFavorites("http://localhost:8080/favBoyNames", "#favBoyList",
      "#boyNameDataName", boyNameDataModal, boyNameDataDiv);
  });
};

// Add a girl name to the favs list
var addGirl = document.querySelector("#addGirlName");
addGirl.onclick = function () {
  // inputField.value to get whatever was typed into field
  var newGirlInput = document.querySelector("#newGirlName");
  var newGirl = newGirlInput.value;

  var body = "name=" + encodeURIComponent(newGirl) + "&" +
    "gender=" + encodeURIComponent('F') + "&" +
    "n=" + encodeURIComponent(null) + "&" +
    "rank=" + encodeURIComponent(null) + "&" +
    "origin=" + encodeURIComponent(null) + "&" +
    "fav=" + encodeURIComponent(1);

  fetch("http://localhost:8080/favGirlNames", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    // call function to do the GET request
    fetchFavorites("http://localhost:8080/favGirlNames", "#favGirlList",
      "#girlNameDataName", girlNameDataModal, girlNameDataDiv);
  });
};

/*
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
*/

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



/*
var deleteBtn = document.createElement("button");
deleteBtn.innerHTML = "delete";
deleteBtn.onclick = function () {

}
newListItem.appendChild(deleteBtn);
*/


clickListenerMove("#boyNameList", "#favBoyList");
clickListenerMove("#girlNameList", "#favGirlList");

// code for modal input form
var modalBtn = document.querySelector("#modal-btn")
var modal = document.querySelector(".inputModal")
var closeBtn = document.querySelector(".close-btn")
var cancelBtn = document.querySelector("#cancel")

modalBtn.onclick = function(){
  modal.style.display = "block"
}

closeBtn.onclick = function(){
  modal.style.display = "none"
}

cancelBtn.onclick = function(){
  modal.style.display = "none";
    // clear the text boxes
  document.querySelector("#inputName").value = '';
  document.querySelector("#inputN").value = '';
  document.querySelector("#inputRank").value = '';
  document.querySelector("#inputOrigin").value = '';
}

window.onclick = function(e){

  if(e.target == modal) {
    modal.style.display = "none"
  } else if(e.target == boyNameDataModal) {
    boyNameDataModal.style.visibility = "hidden";
    clearList(boyNameDataDiv);
  } else if(e.target == girlNameDataModal) {
    girlNameDataModal.style.visibility = "hidden";
    clearList(girlNameDataDiv);
  }
}

function clearList (parentEl) {
  var child = parentEl.lastElementChild;
  while (child) {
    parentEl.removeChild(child);
    child = parentEl.lastElementChild;
  }
}

function closeDataModal (btn, modal, div) {
  var closeBtn = document.querySelector(btn);
  closeBtn.onclick = function() {
    modal.style.visibility = "hidden";
    clearList(div);
  }
}

closeDataModal("#boyDataClose", boyNameDataModal, boyNameDataDiv);
closeDataModal("#girlDataClose", girlNameDataModal, girlNameDataDiv);

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
  var newN = newNInput.value;

  var newRankInput = document.querySelector("#inputRank");
  var newRank = newRankInput.value;

  var newOriginInput = document.querySelector("#inputOrigin");
  var newOrigin = newOriginInput.value;

  var newFavInput = document.querySelector("#inputFav");
  var newFav = 0

  if (newFavInput.checked) {
    newFav = newFavInput.value;
  }


  //encodes any special characters
  var body = "name=" + encodeURIComponent(newName) + "&" +
  "gender=" + encodeURIComponent(newGender) + "&" +
  "n=" + encodeURIComponent(newN) + "&" +
  "rank=" + encodeURIComponent(newRank) + "&" +
  "origin=" + encodeURIComponent(newOrigin) + "&" +
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
    refreshFavorites();
    modal.style.display = "none";

    // clear the text boxes
    document.querySelector("#inputName").value = '';
    document.querySelector("#inputN").value = '';
    document.querySelector("#inputRank").value = '';
    document.querySelector("#inputOrigin").value = '';
    document.querySelector("#inputFav").value = '';

  });
};
