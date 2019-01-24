// This file is in the entry point in your webpack config.
// process.env.api_url = "http://localhost:3000";


// currentWeatherContainer = document.getElementById('current-weather-container');
$( document ).ready(function() {
    console.log("ready");
});

function populateCurrentWeather(data){
  console.log("Enter populateCurrentWeather")
}

  $("#get-weather-button").click(function(){
    query = document.getElementById('weather-location-query').value

    function reqListener() {
      response = this.responseText;
      data = parseCurrentWeather(response);
      displayCurrentWeather(data);
      displayCurrentWeatherDetail(data);
    }

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);

    loc = document.getElementById('weather-location-query')

    //Assuming incoming query is correctly formatted
    params = "?location="+loc.value
    oReq.open("GET", "http://localhost:3000/api/v1/forecast"+params);
    oReq.send();
})

function parseCurrentWeather(response){
  json = JSON.parse(response);
  data = json['data'];
  return data;
}

function displayCurrentWeather(data){
  currentWeather = document.getElementById('current-weather-container');

  time = data["attributes"]["current"]["time"];
  temp = data['attributes']['current']['temperature'];
  
  currentWeather.innerHTML = "Current Tempertature: "+data['attributes']['current']['temperature'];
  debugger;
}
