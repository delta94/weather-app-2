import {updateDOM} from './domManager.js'

function getDefaultResponse() {
  let symbol = "C";

  if (localStorage.getItem("degreesSymbol")){
    symbol = JSON.parse(localStorage.getItem("degreesSymbol"));
  }

  (async () => {
    try{
      let retrievedData = await getLocationFromSearch("london");

      if (localStorage.getItem('currentData')) {
        let data = JSON.parse(localStorage.getItem('currentData'));
        updateDOM(data, symbol);
      } else {
        saveCurrentData(retrievedData);
        updateDOM(retrievedData, symbol);
      }
    } catch(error) {
      console.log("Request to the API failed. " + error);
    }
  })();
}

async function getLocationFromSearch(searchQuery) {
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=78747b1da945646a8cdb460c733e1144`);
    let locationInfo = await response.json();

    return locationInfo;

  } catch(error) {
    console.log("The request to the API failed");
    console.log(error);
  }
}

async function getLocationFromCoords(lat, lon) {
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=78747b1da945646a8cdb460c733e1144`);
    let locationInfo = await response.json();

    return locationInfo;

  } catch(error) {
    console.log("The request to the API failed");
    console.log(error);
  }
}

function getTempInFormat(temperature, format) {
  let tempInC = temperature - 273.15;

  if (format.toUpperCase() == "F") {
    let tempInF = (tempInC * 9/5) + 32;
    return Math.round(tempInF * 10) / 10;
  }
  else{
    return Math.round(tempInC * 10) / 10;
  }
}

function saveCurrentData(data) {
  localStorage.setItem("currentData", JSON.stringify(data));
}

function getSavedData() {
  let data = JSON.parse(localStorage.getItem('currentData'));
  return data
}

export {getDefaultResponse,
        getLocationFromSearch, 
        getLocationFromCoords, 
        getTempInFormat, 
        saveCurrentData, 
        getSavedData}