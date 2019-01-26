// This file is in the entry point in your webpack config.
// process.env.api_url = "http://localhost:3000";

  $("#get-weather-button").click(function(){
    query = document.getElementById('weather-location-query').value

    function reqListener() {
      response = this.responseText;
      data = parseCurrentWeather(response);

      displayCurrentWeather(data);
      displayCurrentWeatherDetail(data);
      displayHourlyWeather(data);
      displayDailyWeather(data);
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

  date = new Date(data["attributes"]["current"]["time"]*1000);
  temp = data['attributes']['current']['temperature'];

  currentWeather = document.getElementById('current-weather-container');
  currentWeather.innerHTML = `Time: ${date}
    Current Tempertature: ${temp}` ;
}

function displayCurrentWeatherDetail(data){
  current = data["attributes"]["current"]

// Add let here. These are currently globally scoped
  icon = current["icon"];
  summary = current["summary"];
  feelsLike = current["apparentTemperature"];
  humidity = current["humidity"];
  visibility = current["visibility"];
  uvIndex = current["uvIndex"];

  currentWeatherDetail = document.getElementById('current-weather-detail-container');
  currentWeatherDetail.innerHTML = `Icon: ${icon}
    Summary: ${summary}
    Feels Like: ${feelsLike}
    Humidity: ${humidity}
    Visibility: ${visibility}
    UV Index: ${uvIndex}
    `;
}

function displayHourlyWeather(data){
  data['attributes']['hourly'].forEach(function(element){
    buildWeatherHour(element)
  })
}

function buildWeatherHour(element){
  hourlyContainer = document.getElementById('hourly-weather-container')
  time = parseTime(element.time)
  hour = `Time: ${time}
          Icon: ${element.icon}
          Temp: ${element.temperature}`
  var node = document.createElement("div");
  node.innerHTML = hour;
  hourlyContainer.appendChild(node);
}

function displayDailyWeather(element){
  data['attributes']['seven_day'].forEach(function(element){
    buildWeatherDay(element)
  })
}

function buildWeatherDay(element){
  dailyContainer = document.getElementById('daily-weather-container')
  day =  `Date: ${parseDate(element.time)}
          High: ${element.temperatureHigh}
          Low: ${element.temperatureLow}
          PrecipChance: ${element.precipProbability}
          Icon: ${element.icon}`
  var node = document.createElement("div");
  node.innerHTML = day;
  dailyContainer.appendChild(node);
}

function parseTime(unixTime){
  date = new Date(unixTime*1000);
  hr = date.getHours();
  min = "0" + date.getMinutes();
  return (hr + ':' + min.substr(-2));
}

function parseDate(unixTime){
  return (new Date(unixTime*1000).toDateString);
}
