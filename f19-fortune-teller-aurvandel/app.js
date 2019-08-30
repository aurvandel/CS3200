// temp data structures for random picks
var boyNames = [
    {
        "name": "Liam",
        "gender": "M",
        "n": "19837"
    },
    {
        "name": "Noah",
        "gender": "M",
        "n": "18267"
    },
    {
        "name": "William",
        "gender": "M",
        "n": "14516"
    },
    {
        "name": "James",
        "gender": "M",
        "n": "13525"
    },
    {
        "name": "Oliver",
        "gender": "M",
        "n": "13389"
    },
    {
        "name": "Benjamin",
        "gender": "M",
        "n": "13381"
    },
    {
        "name": "Elijah",
        "gender": "M",
        "n": "12886"
    }
];

var girlNames = [
    {
        "name": "Emma",
        "gender": "F",
        "n": "18688"
    },
    {
        "name": "Olivia",
        "gender": "F",
        "n": "17921"
    },
    {
        "name": "Ava",
        "gender": "F",
        "n": "14924"
    },
    {
        "name": "Isabella",
        "gender": "F",
        "n": "14464"
    },
    {
        "name": "Sophia",
        "gender": "F",
        "n": "13928"
    },
    {
        "name": "Charlotte",
        "gender": "F",
        "n": "12940"
    }
];

// query buttons
var boyButton = document.querySelector("#boyButton");
var girlButton = document.querySelector("#girlButton");

// query tags for placing HTML
var boyPick = document.querySelector("#boyName");
var girlPick = document.querySelector("#girlName")


boyButton.onclick = function () {
	var randomBoy = Math.floor(Math.random() * boyNames.length)
	boyPick.innerHTML = boyNames[randomBoy].name;
}

girlButton.onclick = function () {
	var randomGirl = Math.floor(Math.random() * girlNames.length)
	girlPick.innerHTML = girlNames[randomGirl].name;
}
