import {getLocationFromSearch, 
        getTempInFormat, 
        saveCurrentData, 
        getSavedData} 
        from './dataHandler.js'
import geoFind from './geolocator.js'

function searchHandler() {
  let searchInput = document.querySelector('.nav-search-bar input');

  let symbol = "C";
  
  if (localStorage.getItem('degreesSymbol')) {
    symbol = JSON.parse(localStorage.getItem('degreesSymbol'));
  }

  (async () => {
    try{
      let retrievedData = await getLocationFromSearch(searchInput.value);
      saveCurrentData(retrievedData);
      updateDOM(retrievedData, symbol);
    } catch(error) {
      console.log("Request to the API failed. " + error);
    }
  })();

  searchInput.value = "";
}


function updateDOM(weatherData, degreesSymbol) {

  const locationName = document.querySelector('.location-name');
  const locationTemp = document.querySelector('.location-temperature');
  const locationHumidity = document.querySelector('.location-humidity');
  const locationDesc = document.querySelector('.location-description');

  let mainTemp = getTempInFormat(weatherData.main.temp, degreesSymbol);
  let lowestTemp = getTempInFormat(weatherData.main.temp_min, degreesSymbol);
  let highestTemp = getTempInFormat(weatherData.main.temp_max, degreesSymbol);
  let tomorrow = getTempInFormat(weatherData.main.temp_max, degreesSymbol);

  let mainDesc = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);

  locationName.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
  locationTemp.textContent = `${mainTemp}°${degreesSymbol}`;
  locationHumidity.textContent = `Humidity: ${weatherData.main.humidity}%`;
  locationDesc.textContent = mainDesc;


  let currentTemp = document.querySelector('.current-weather-container .info-temperature');
  let currentDesc = document.querySelector('.current-weather-container .info-description');
  currentTemp.textContent = `${mainTemp}°${degreesSymbol}`;
  currentDesc.textContent = mainDesc;

  let todaysHighTemp = document.querySelector('.todays-high-container .info-temperature');
  let todaysHighDesc = document.querySelector('.todays-high-container .info-description');
  todaysHighTemp.textContent = `${highestTemp}°${degreesSymbol}`
  todaysHighDesc.textContent = mainDesc;

  let todaysLowTemp = document.querySelector('.todays-low-container .info-temperature');
  let todaysLowDesc = document.querySelector('.todays-low-container .info-description');
  todaysLowTemp.textContent = `${lowestTemp}°${degreesSymbol}`
  todaysLowDesc.textContent = mainDesc;

  let tomorrowTemp = document.querySelector('.tomorrows-weather-container .info-temperature');
  let tomorrowDesc = document.querySelector('.tomorrows-weather-container .info-description');
  tomorrowTemp.textContent = `${tomorrow}°${degreesSymbol}`;
  tomorrowDesc.textContent = `${mainDesc}`;
}

function createEventListeners() {
  let symbol = "C";

  if (localStorage.getItem('degreesSymbol') != null) {
    symbol = JSON.parse(localStorage.getItem("degreesSymbol"));
  }
  
  let searchBtn = document.querySelector('.nav-search-bar button');

  searchBtn.addEventListener('click', searchHandler);
  searchBtn.addEventListener("keyup", event => {
    if(event.key !== "Enter") return;
    console.log("search");
    searchHandler();
    event.preventDefault();
  });

  let locationBtn = document.querySelector('.location-btn');

  locationBtn.addEventListener('click', () => {
    geoFind();
  })

  let navToggle = document.querySelector('.nav-toggle input');
  navToggle.checked = false;

  if(JSON.parse(localStorage.getItem('navToggled'))){
    navToggle.checked = JSON.parse(localStorage.getItem('navToggled'));
  } 

  navToggle.addEventListener('click', () => {
    navToggle.checked ? symbol = "F" : symbol = "C";
    
    localStorage.setItem("degreesSymbol", JSON.stringify(symbol));
    localStorage.setItem("navToggled", JSON.stringify(navToggle.checked));

    let savedData = getSavedData();
    updateDOM(savedData, symbol);
  });
}

export {createEventListeners, updateDOM}