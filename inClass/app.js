//alert("Hello, JS. I am loaded.");

//var x = 12;   // var to declare a variable
//x = 7;        // no var when reassigning


//var h1 = document.querySelector("h1");      // variable availiable to access the DOM
//h1.innerHTML = "Is this working??";          // chnanges at lod time
//h1.style.color = "#00c00";    //text color
//h1.style.backgroundColor = "#cccccc";

var LUNCHPLACES = [
  {
    'name': "Applebee's",
    'cuisine': 'American'
  },
  {
    'name': 'Red Fort',
    'cousine': 'Indian'
  }
];

var decideButton = document.querySelector("#decide");
//console.log("BUTTON", decideButton);      //print statement
decideButton.onclick = function () {
  var placeDiv = document.querySelector('#place');

  //randomizer stuff
  var randomIndex = Math.floor(Math.random() * LUNCHPLACES.length)
  var placeObj = LUNCHPLACES[randomIndex];

  // Both of these are the same
  //placeDiv.innerHTML = placeObj["name"];
  placeDiv.innerHTML = placeObj.name;
  //console.log("The button was clicked");
  // Make something happen on the webpage side
  // Have an element in the html with a selector but no content

  // Add element to history list
  var historyList = document.querySelector("#history");
  //console.log("LIST", historyList);

  var newListItem = document.createElement("li");   //Don't need to query
  newListItem.innerHTML = placeObj.name;

  historyList.appendChild(newListItem);
};


fetch("url").then(function(response) {

  console.log("server responded.");
  response.json().then(function(data) {
    console.log("data received from server: ", data);
    //data is ready to use (mine is an array of objects)
    LUNCHPLACES = data;

    //alternative loop over the data and display it immediately
    LUNCHPLACES.forEach(function(place) {
      // append each place to anew element in the DOM
    });
  )};


});



var addButton = document.querySelector("#add");

addButon.onclick = function () {
  // inputField.value to get whatever was typed into field
  var newRestaurantInput = document.querySelector("#new-restaurant");
  var newRestaurant = newRestaurantInput.value;
  
  var body = "name=" + encodeURIComponent(newRestaurant);  //encodes any special characters
  
  fetch("http://localhost:8080/restaurants", {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }).then(function (response) {
    console.log("server responded")
  });
};
