import {getLocationFromCoords, saveCurrentData} from './dataHandler.js'
import {updateDOM} from './domManager.js'

function geoFind() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function success(location) {
  let latitude = location.coords.latitude;
  let longitude = location.coords.longitude;

  let symbol = JSON.parse(localStorage.getItem('degreesSymbol'));

  (async () => {
    try{
      let retrievedData = await getLocationFromCoords(latitude, longitude);
      saveCurrentData(retrievedData);
      updateDOM(retrievedData, symbol);
    } catch(error) {
      console.log("Request to the API failed. " + error);
    }
  })();
}

export default geoFind