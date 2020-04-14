//data
let currentKitten = {};
let kitten = {};
let index = 0;

/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
loadKittens();

/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault();
  let form = event.target;
  let kId = generateId();
  let kitten = {
    id: kId,
    name: form.name.value,
    mood: null,
    affection: Math.ceil(Math.random() * 10),
  };
  let index = kittens.findIndex((kitten) => kitten.name == form.name.value);
  if (index < 0) {
    kittens.push(kitten);
    setKittenMood(kId);
    saveKittens();
    drawKittens();
  } else {
    alert("Kitten Already Exists!");
  }
  form.reset();
  document.getElementById("welcome").classList.add("hidden");
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  // setKittenMood();
  window.localStorage.setItem("kittens", JSON.stringify(kittens));
  console.log("saveKittens() Success!");
  drawKittens();
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let kittensData = JSON.parse(window.localStorage.getItem("kittens"));
  if (kittensData) {
    kittens = kittensData;
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittenListElement = document.getElementById("kittens");
  let ranAway = "";
  let kittensTemplate = "";
  kittens.forEach((kitten) => {
    // @ts-ignore
    if (kitten.affection < 1 || kitten.affection == "Ran Away!") {
      ranAway = "hidden";
      // @ts-ignore
      kitten.affection = "Ran Away!"
    }
    kittensTemplate += `
    <div class="k-card kitten ${kitten.mood} mt-1" >
      
      <center>
        <img src="https://robohash.org/${kitten.name}/?set=set4" alt="Moody Kitten"></i>
      </center>
      
      <h3><B>Name:</B> ${kitten.name}</h3>
      <div>
        <div><B>Mood:</B> ${kitten.mood}</div>
        <div><B>Affection:</B> ${kitten.affection}</div>
      </div>
      
      <div class="d-flex space-between mt-1 ${ranAway}">
        <button class="action btn-cancel" type="button" onclick="pet('${kitten.id}')">Pet</button>
          <span title="Send kitten to the pound!">
            <i class="action text-danger fa fa-trash" onclick="removeKittenById('${kitten.id}')"></i>
          </span>
        <button class="action" type="button" onclick="catnip('${kitten.id}')">Catnip</button>
      </div>
      
    </div>
    &nbsp;&nbsp;`;
    ranAway = "";
    });
  kittenListElement.innerHTML = kittensTemplate;
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  console.log("entered function findKittenById()");
  let index = kittens.findIndex((kitten) => kitten.id == id);
  if (index == -1) {
    throw new Error("Invalid Kitten Id");
  }
  return kittens.find((k) => k.id == id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  console.log("entered pet()");
  let index = kittens.findIndex((kitten) => kitten.id == id);
  let currentKitten = findKittenById(id);
  let currentAffection = currentKitten.affection;
  //console.log("Current Affection: " + currentAffection);
  let modAffection = Math.random();
  if (modAffection > 0.7) {
    currentAffection++;
  } else {
    currentAffection--;
  }
  console.log("Modifier: " + modAffection);
  console.log("New Affection: " + currentAffection);
  console.log(index);
  kittens.splice(index, 1, {
    id: currentKitten.id,
    name: currentKitten.name,
    mood: currentKitten.mood,
    affection: currentAffection,
  });
  //console.log(currentKitten);
  setKittenMood(id);
  saveKittens();
  drawKittens();
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  console.log("Entered catnip()");
  let index = kittens.findIndex((kitten) => kitten.id == id);
  let catNipt = findKittenById(id);
  kittens.splice(index, 1, {
    id: catNipt.id,
    name: catNipt.name,
    mood: "Tolerant",
    affection: 5,
  });
  saveKittens();
  drawKittens();
}
/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0  << what is 6?
 * Happy > 5, Tolerant <= 5, Angry <= 3, Gone <= 0  << use this scale instead
 * @param {Kitten} kitten
 */
function setKittenMood(id) {
  let index = kittens.findIndex((kitten) => kitten.id == id);
  let catMood = findKittenById(id);

  console.log(catMood);
  console.log(catMood.mood);

  if (catMood.affection <= 0) {
    catMood.mood = "Gone";
  } else {
    if (catMood.affection <= 3) {
      catMood.mood = "Angry";
    } else {
      if (catMood.affection <= 5) {
        catMood.mood = "Tolerant";
      } else {
        catMood.mood = "Happy";
      }
    }
  }

  kittens.splice(index, 1, {
    id: catMood.id,
    name: catMood.name,
    mood: catMood.mood,
    affection: catMood.affection,
  });
  saveKittens();
}

function getStarted() {
  document.getElementById("welcome").remove();
  drawKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

/**
 * This function is called with a kitten id
 * and will use the id to find and remove the
 * kitten by their id from the list of kittens:
 * @param {string} kittenID
 */
function removeKittenById(kittenID) {
  let index = kittens.findIndex((kitten) => kitten.id == kittenID);
  if (index == -1) {
    throw new Error("Invalid Kitten Id");
  }
  kittens.splice(index, 1);
  //console.log("removeKittenById() Success");
  saveKittens();
}

/**
 * This function is called to slaughter all kittens.
 */
function freshStart() {
  document.getElementById("welcome").remove();
  kittens = [];
  saveKittens();
  drawKittens();
}
