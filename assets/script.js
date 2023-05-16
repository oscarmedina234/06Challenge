//Global Variables
const apiKey = 'b7c7ccc70e30ad231848f692e9a70270';
const savedSearches = [];

//getting the form input

$("#search-form").on('submit', function(event) {
    event.preventDefault();

    //getting the city user input
let cityName = $("#citySearch").val();


if (cityName === "" || cityName === null) {
    //will alert user if search bar is empty
    alert("Please enter name a city into the search bar.");
    event.preventDefault(); 
} else {
// city name will be passed to these functions
    currentWeather(cityName);
    fiveDayForecast(cityName);
}
});


//get current weather function 

let currentWeather = function(cityName) {

 fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
 
 .then(function(response) {
    return response.json();
 })
.then(function(response) {
    let cityLon = response[0].lon;
    let cityLat = response[0].lat;



    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&units=imperial`)

    .then(function(response) {
        return response.json();
    })

    .then (function(response) {
        searchHistoryList(cityName);

//add to current weather section
let currentWeatherContainer = $("#current-weather-continer");
currentWeatherContainer.addClass("row d-block card");

//add elements to the screen 
let currentTitle = $("#current-title");
let currentDay = moment().format("M/D/YYYY");
currentTitle.text(`${cityName} (${currentDay})`);
let currentIcon = $("#current-weather-icon");
currentIcon.addClass("current-weather-icon");
let currentIconCode = response.weather[0].icon;
currentIcon.attr("src", `https://openweathermap.org/img/wn/${currentIconCode}@2x.png`);

//current temp
let currentTemp = $("#current-temp");
currentTemp.text(`Temperature: ${response.main.temp} Fahrenheit`);

//current humidity 
let currentHumidity = $("#current-hum");
currentHumidity.text(`Humidity: ${response.main.humidity}%`);

//current wind 
let currentWind = $("#current-wind");
currentWind.text(`Wind Speed: ${response.wind.speed} MPH`);

    })
})
.catch(function(err) {
    $("#search-input").val("");

    alert("We could not find the city you searched for. Try another city.");
});
};


let fiveDayForecast = function(cityName) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`)
 
 .then(function(response) {
    return response.json();
 })
.then(function(response) {
    let cityLon = response[0].lon;
    let cityLat = response[0].lat;

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}`)

    .then(function(response) {
        //return console.log(response.json());
        return response.json();
    })

    .then (function(response) { 
    
        let futureForecastTitle = $("#future-forecast-title");
        futureForecastTitle.text("5-Day Forecast:")

        for (let i = 0; i <= 5; i++) {
            let futureCard = $("#forecasts-cards-container");

            let futureDate = $("#future-date-" + i);
            date = moment().add(i, "d").format("M/D/YYYY");
            futureDate.text(date);

            //let futureIcon = $("#future-icon-" + i);
            //let futureIconCode = response.list[i].weather[i].icon;
            //futureIcon.attr("src", `https://openweathermap.org/img/wn/${futureIconCode}@2x.png`);

            let futureTemp = $("#future-temp-" + i);
            futureTemp.text(`Temp: ${response.list[i].main.temp} Fahrenheit`);

            let futureHum = $("#future-humidity-" + i);
            futureHum.text(`Humidity: ${response.list[i].main.humidity}%`);
        }
})
})
};

let searchHistoryList = function(cityName) {
    $('.past-search:contains("' + cityName + '")').remove();

    // create entry with city name
    let searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    // create container for entry
    let searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    // append entry to container
    searchEntryContainer.append(searchHistoryEntry);

    // append entry container to search history container
    let searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (savedSearches.length > 0){
        // update savedSearches array with previously saved searches
        let previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    // add city name to array of saved searches
    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    // reset search input
    $("#search-input").val("");

};

// load saved search history entries into search history container
let loadSearchHistory = function() {
    // get saved search history
    let savedSearchHistory = localStorage.getItem("savedSearches");

    // return false if there is no previous saved searches
    if (!savedSearchHistory) {
        return false;
    }

    // turn saved search history string into array
    savedSearchHistory = JSON.parse(savedSearchHistory);

    // go through savedSearchHistory array and make entry for each item in the list
    for (let i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i]);
    }
};
