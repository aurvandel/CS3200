// Global variables used for name lists
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

// Get the list of favorite boy names
var boyNameDataModal = document.querySelector("#boyNameData");
var boyNameDataDiv = document.querySelector("#boyNameDataSpan");
// Get the list of favorite girl names
var girlNameDataModal = document.querySelector("#girlNameData");
var girlNameDataDiv = document.querySelector("#girlNameDataSpan");

// Add a boy name to the favs list
var addBoy = document.querySelector("#addBoyName");

// Add a girl name to the favs list
var addGirl = document.querySelector("#addGirlName");

// code for modal input form
var modalBtn = document.querySelector("#modal-btn");
var modal = document.querySelector(".inputModal");
var closeBtn = document.querySelector(".close-btn");
var cancelBtn = document.querySelector("#cancel");
var submitBtn = document.querySelector("#submit");

// Function declerations

// request the data from the server for the complete boy names:
function getBoyList() {
  fetch("http://localhost:8080/boyNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    boyNames = data;

    });
  });
};

// request the data from the server for the girl names:
function getGirlList() {
  fetch("http://localhost:8080/girlNames").then(function (response) {
  // parse (unpackage) the data from the server:
  response.json().then(function (data) {
    // (data is a list of objects)
    // save the data for use later (when the button is clicked):
    girlNames = data;
    });
  });
};

// sets up the favorite lists with all it's functionality
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
              if (data.rank !== "null") {
                rank.innerHTML = "Popularity: " + data.rank;
              } else {
                rank.innerHTML = "Popularity: Unknown";
              }
              nameDataDiv.appendChild(rank);

              var n = document.createElement("p");
              if (data.n !== "null") {
                n.innerHTML = "Number: " + data.n;
              } else {
                n.innerHTML = "Number: Unknown";
              }
              nameDataDiv.appendChild(n);

              var origin = document.createElement("p");
              if (data.origin !== "null") {
                origin.innerHTML = "Origin: " + data.origin;
              } else {
                origin.innerHTML = "Origin: Unknown";
              }
              nameDataDiv.appendChild(origin);

              // Delete button
              var deleteBtn;
              var editBtn;
              if (data.gender == "M") {
                deleteBtn = document.querySelector("#boyDataDelete");
                editBtn = document.querySelector("#boyDataEdit");
              } else {
                deleteBtn = document.querySelector("#girlDataDelete");
                 editBtn = document.querySelector("#girlDataEdit");
              }

              editBtn.onclick = function () {
                editName(memberPath)
              }

              deleteBtn.onclick = function () {
                if(confirm("Are you sure you want to delete " + data.name + "?")) {
                  deleteName(memberPath);
                }
              }

          });
        });
        nameDataModal.style.visibility = "visible";
      });
    })
    });
  });
}

// Refreshes favorites list
function refreshFavorites () {
  fetchFavorites("http://localhost:8080/favBoyNames", "#favBoyList",
  "#boyNameDataName", boyNameDataModal, boyNameDataDiv);
  fetchFavorites("http://localhost:8080/favGirlNames", "#favGirlList",
  "#girlNameDataName", girlNameDataModal, girlNameDataDiv);
}

// Moves the random name to the appropriate favorites list
function mouseOverListener(name, item, nameDataModal, path, nameDataDiv, dataModalNameEl) {
  fetch(path).then(function(response) {
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

      // Delete button
      var deleteBtn;
      var editBtn;
      if (data.gender == "M") {
        deleteBtn = document.querySelector("#boyDataDelete");
        editBtn = document.querySelector("#boyDataEdit");
      } else {
        deleteBtn = document.querySelector("#girlDataDelete");
         editBtn = document.querySelector("#girlDataEdit");
      }

      editBtn.onclick = function () {
        editName(path)
      }

      deleteBtn.onclick = function () {
        if(confirm("Are you sure you want to delete " + data.name + "?")) {
          deleteName(path);
        }

      };
    });
    var tgt = item.target;
    tgt.style.color = "red";
    nameDataModal.style.visibility = "visible";
  });
}

function mouseOutListener(item) {
  item.target.style.color = "black";
}

// function to move names from history list to favs
function clickListenerMove (nameObj, path) {

  var nameData = validateData(nameObj);
  //encodes any special characters
  var body = "name=" + encodeURIComponent(nameData.name) +
  "&gender=" + encodeURIComponent(nameData.gender) +
  "&n=" + encodeURIComponent(nameData.n) +
  "&rank=" + encodeURIComponent(nameData.rank) +
  "&origin=" + encodeURIComponent(nameData.origin) +
  "&fav=" + encodeURIComponent(1);
  fetch(path, {
    method: "PUT",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    // call function to do the GET request
    refreshFavorites();
  });
};

// ensures that input fields are not blank
function validateData(nameObj) {
  if (!nameObj.origin) {
    nameObj.origin = null;
  }
  if (!nameObj.n) {
    nameObj.n = null;
  }
  if (!nameObj.rank) {
    nameObj.rank = null;
  }
  return nameObj;
}

// clears the input fields
function clearInputs () {
  document.querySelector("#inputName").value = '';
  document.querySelector("#inputN").value = '';
  document.querySelector("#inputRank").value = '';
  document.querySelector("#inputOrigin").value = '';
  document.querySelector("#inputFav").checked=false;
  document.querySelector("#genderMale").checked=false;
  document.querySelector("#genderFemale").checked=false;
  document.querySelector("#genderNone").checked=false;
};

// closes all the modals
function closeModals () {
  boyNameDataModal.style.visibility = "hidden";
  girlNameDataModal.style.visibility = "hidden";
  document.querySelector(".loginModal").style.display = "none";
};

function deleteName(path) {
  fetch(path, {method: "DELETE"}).then(function() {
    // call function to do the GET request
    closeModals();
    refreshFavorites();
  });
};

function editName(path) {
  modal.style.display = "block";
  closeModals();

  // replace the old submit button with an update button
  submitBtn.innerHTML = "Update";
  // replace the descriptive text on the modal
  document.querySelector("#modalDescription").innerHTML = "Update Name Data";

  // retrieve info from member and put in text boxes
  fetch(path).then(function(response) {
    response.json().then(function(data) {
      var name = document.querySelector("#inputName");
      name.value = data.name;

      var n = document.querySelector("#inputN");
      n.value = data.n;

      var rank = document.querySelector("#inputRank");
      rank.value = data.rank;

      var origin = document.querySelector("#inputOrigin");
      origin.value = data.origin;

      var gender;
      if (data.gender == "M") {
        gender = document.querySelector("#genderMale");
      } else if (data.gender == "F") {
        gender = document.querySelector("#genderFemale");
      } else {
        gender = document.querySelector("#genderOther");
      }
      gender.checked=true;

      var fav = document.querySelector("#inputFav");
      if (data.fav == 1) {
        fav.checked=true;
      }

    });
  });
  var updateBtn = document.querySelector("#submit");
  updateBtn.onclick = function () {
    submitName("PUT", path);
  };
};

// shows alert if login validation fails
function failedValidation (err) {
  alert("Please enter a valid " + err );
};

// clear favorits lists before repopulating
function clearList (parentEl) {
  var child = parentEl.lastElementChild;
  while (child) {
    parentEl.removeChild(child);
    child = parentEl.lastElementChild;
  }
};

// close the name data models
function closeDataModal (btn, modal, div) {
  var closeBtn = document.querySelector(btn);
  closeBtn.onclick = function() {
    modal.style.visibility = "hidden";
    clearList(div);
  }
};

// Add a new name to the database
function submitName(method, path) {
  submitBtn.innerHTML = "Submit";
  // replace the descriptive text on the modal
  document.querySelector("#modalDescription").innerHTML = "Please feel free to add a name to our list";
  // inputField.value to get whatever was typed into field

  var newNameInput = document.querySelector("#inputName");
  if (newNameInput.checkValidity()) {
    var newName = newNameInput.value;

    var newGenderInputs = document.getElementsByName('inputGender');

     for(i = 0; i < newGenderInputs.length; i++) {
        if(newGenderInputs[i].checked) {
         var newGender = newGenderInputs[i].value;
       }
     }

    var newNInput = document.querySelector("#inputN");
    var newN = newNInput.value;
    if (!newN) {
      newN = null;
    }

    var newRankInput = document.querySelector("#inputRank");
    var newRank = newRankInput.value;
    if (!newRank) {
      newRank = null;
    }

    var newOriginInput = document.querySelector("#inputOrigin");
    var newOrigin = newOriginInput.value;
    if (!newOrigin) {
      newOrigin = null;
    }

    var newFavInput = document.querySelector("#inputFav");
    var newFav = 0

    if (newFavInput.checked) {
      newFav = newFavInput.value;
    }

    //encodes any special characters
    var body = "name=" + encodeURIComponent(newName) +
    "&gender=" + encodeURIComponent(newGender) +
    "&n=" + encodeURIComponent(newN) +
    "&rank=" + encodeURIComponent(newRank) +
    "&origin=" + encodeURIComponent(newOrigin) +
    "&fav=" + encodeURIComponent(newFav);

    fetch(path, {
      method: method,
      body: body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      // call function to do the GET request
      refreshFavorites();
      modal.style.display = "none";

      // clear the text boxes
      clearInputs();
    });
    } else {
    alert("Please enter a name");
  }
  submitBtn.onclick = function () {
    if (gender == "M") {
      submitName("POST", "http://localhost:8080/favBoyNames");
    }
    if (gender == "F") {
      submitName("POST", "http://localhost:8080/favGirlNames")
    }
  };
};


// onclick functions

var openLogin = document.querySelector("#openLoginBtn");
openLogin.onclick = function () {
  console.log("clicked")
  document.querySelector(".loginModal").style.display = "block";
}

var loginBtn = document.querySelector("#loginBtn");
loginBtn.onclick = function (){
  var userNameInput = document.querySelector("#inputUserName");
  var passwordInput = document.querySelector("#password");
  var username = userNameInput.value;
  var password = passwordInput.value;

  var body = "username=" + encodeURIComponent(username) +
    "&password=" + encodeURIComponent(password);

    fetch("http://localhost:8080/sessions", {
  method: "POST",
  body: body,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  }).then(function (response) {
    if (response.status == 401) {
      alert("invalid username or password");
    } else if (response.status == 201) {
      closeModals();
    }

    // clear the text boxes
    userNameInput.value = "";
    passwordInput.value = "";
  });
};

var newUserBtn = document.querySelector("#newUserBtn");
newUserBtn.onclick = function () {
  closeModals();
  var regModal = document.querySelector("#registrationModal");
  regModal.style.display = "block";
}

// function to display random name on button click
boyButton.onclick = function () {
  var randomBoy = Math.floor(Math.random() * boyNames.length)
  boyPick.innerHTML = boyNames[randomBoy].name;
  var path = "http://localhost:8080/favBoyNames/" + boyNames[randomBoy].id;

  //hover listener for name
  boyPick.addEventListener("click", function (item) {
    mouseOverListener(boyNames[randomBoy].name, item, boyNameDataModal,
    path, boyNameDataDiv, "#boyNameDataName");
    clearList(boyNameDataDiv)
  });
  boyPick.addEventListener("mouseleave", function(item) {
    mouseOutListener(item);
  });


  // Place in history list
  var boyHistoryList = document.querySelector("#boyNameList");
  var newBoyListItem = document.createElement("li");
  newBoyListItem.innerHTML = boyNames[randomBoy].name;

  // click listener to move name to favorites list
  newBoyListItem.addEventListener("click", function (item) {
    clickListenerMove(boyNames[randomBoy], path,);
    item.target.remove();
  });
  boyHistoryList.appendChild(newBoyListItem);
};

girlButton.onclick = function () {
    var randomGirl = Math.floor(Math.random() * girlNames.length)
    girlPick.innerHTML = girlNames[randomGirl].name;

    var path = "http://localhost:8080/favGirlNames/" + girlNames[randomGirl].id;
    //hover listener for name
    girlPick.addEventListener("click", function (item) {
      mouseOverListener(girlNames[randomGirl].name, item, girlNameDataModal,
      path, girlNameDataDiv, "#girlNameDataName");
    });
    girlPick.addEventListener("mouseout", function(item) {
      mouseOutListener(item);
    });

    // place in history list
    var girlHistoryList = document.querySelector("#girlNameList");
    var newListItem = document.createElement("li");
    newListItem.innerHTML = girlNames[randomGirl].name;

    newListItem.addEventListener("click", function (item) {
      clickListenerMove(girlNames[randomGirl],
        "http://localhost:8080/favGirlNames/" + girlNames[randomGirl].id,
        );
        newListItem.remove();
    });

    girlHistoryList.appendChild(newListItem);
};

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
  newBoyInput.value = "";
};

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
  newGirlInput.value = "";
};

modalBtn.onclick = function(){
  clearInputs ();
  submitBtn.innerHTML = "Submit";
  // replace the descriptive text on the modal
  document.querySelector("#modalDescription").innerHTML = "Please feel free to add a name to our list";

  modal.style.display = "block"

}

closeBtn.onclick = function(){
  modal.style.display = "none"
}

cancelBtn.onclick = function(){
  modal.style.display = "none";
    // clear the text boxes
  clearInputs ();
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
  //clearInputs ();
}

var submitRegBtn = document.querySelector("#submitReg");
submitRegBtn.onclick = function () {
  var inputFirstName = document.querySelector("#inputFirstName");
  var inputLastName = document.querySelector("#inputLastName");
  var inputEmail = document.querySelector("#inputNewEmail");
  var inputPassword = document.querySelector("#inputNewPassword");

  if (inputFirstName.checkValidity()) {
    var firstName = inputFirstName.value;
  } else {failedValidation("first name")}
  if (inputLastName.checkValidity()) {
    var lastName = inputLastName.value;
  } else {failedValidation("last name")}
  if (inputEmail.checkValidity()) {
    var email = inputEmail.value;
  } else {failedValidation("email address")}
  if (inputPassword.checkValidity()) {
    var password = inputPassword.value;
  } else {failedValidation("password")}

  //encodes any special characters
  var body = "fname=" + encodeURIComponent(firstName) +
  "&lname=" + encodeURIComponent(lastName) +
  "&email=" + encodeURIComponent(email) +
  "&password=" + encodeURIComponent(password);

  fetch("http://localhost:8080/users", {
  method: "POST",
  body: body,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  }).then(function (response) {
    // call function to do the GET request

    document.querySelector("#registrationModal").style.display = "none";
    document.querySelector(".loginModal").style.display = "block";

    // clear the text boxes
    inputFirstName.value = "";
    inputLastName.value = "";
    inputEmail.value = "";
    inputPassword.value = "";
  });
};

submitBtn.onclick = function () {
  var newGenderInputs = document.getElementsByName('inputGender');
  for(i = 0; i < newGenderInputs.length; i++) {
    if(newGenderInputs[i].checked) {
      var newGender = newGenderInputs[i].value;
    }
  }

   if (newGender == "M") {
     submitName("POST", "http://localhost:8080/favBoyNames");
   }
   if (newGender == "F") {
     submitName("POST", "http://localhost:8080/favGirlNames")
   }
};

refreshFavorites();
getBoyList();
getGirlList();
closeDataModal("#boyDataClose", boyNameDataModal, boyNameDataDiv);
closeDataModal("#girlDataClose", girlNameDataModal, girlNameDataDiv);


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
