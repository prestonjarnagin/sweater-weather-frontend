// This file is in the entry point in your webpack config.
// process.env.api_url = "http://localhost:3000";
var EMAIL = "";
var PASSWORD = "";
var SERVER_PATH = "localhost:3000";

$('#confirm-login-btn').click(function(){
  let email = $('#email-formfield').val()
  let password = $('#password-formfield').val()
  login(email, password);
});

$('nav').on('click', '#add-new-favorite-btn', function(){
  city = document.getElementById('new-city-form-entry').value;
  addNewFavorite(city);
  return false;
})
function addNewFavorite(city){
  let newCityPath = '/api/v1/favorites'
  fetch(`http://${SERVER_PATH}${newCityPath}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'Accept': 'application/json'
    },
    body: JSON.stringify({
      "api_key": sessionStorage.getItem('key'),
      "location": city
     })
   })
   .then(function(){
     getUserFavorites();
   })
   .catch(error => console.error(error))
   getUserFavorites();
}

function populateFromFavorite(query){
  populateWeather(query);
  $("#weather-location-query").attr("placeholder", `${query}`);
  $("#weather-location-query").val('')

}
function login(email, password){
  let sessionPath = '/api/v1/sessions'
  fetch(`http://${SERVER_PATH}${sessionPath}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'Accept': 'application/json'
    },
    body: JSON.stringify({
      // "email": email,
      // "password": password,
      "email": EMAIL,
      "password": PASSWORD
     })
   })
   .then(response => response.json())
   .then(function(data){
     sessionStorage.setItem('key', data.api_key);
     $('#login-modal').modal('hide');
     displayUserButtons();
     getUserFavorites();
   })
   .catch(error => console.error(error))
}

function logout(){
  sessionStorage.removeItem('key')
  hideUserButtons();
  resetWeatherContainers();
}

$('#get-weather-button').click(function(){
  query = document.getElementById('weather-location-query').value

  populateWeather(query);
})

function populateWeather(query){
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

  //Assuming incoming query is correctly formatted
  params = "?location="+query
  oReq.open("GET", `http://${SERVER_PATH}/api/v1/forecast${params}`);
  oReq.send();
}

function resetWeatherContainers(){
  $('#current-weather-container').empty()
  $('#current-weather-detail-container').empty()
  $('#daily-weather-container').empty()
  $('#hourly-weather-container').empty()
}

function displayUserButtons(){
  $('#open-login-btn').hide();

  let addCityForm = `
  <form id="new-favorite-form" class="px-4 py-3">
    <div class="form-group">
      <label >Add a New City or Location</label>
      <input type="text" class="form-control" id="new-city-form-entry" placeholder="Denver, CO">
    </div>
    <button type="submit" class="btn btn-primary">Add</button>
  </form>
  `
  $('nav').append(
    `<div class="btn-group dropleft" id="favorites-dropdown">
      <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Favorites
      </button>
      <div class="dropdown-menu" id="favorites-dropdown-menu">
        <a class="dropdown-item disabled" href="#">Loading Favorites</a>
      <div class="dropdown-divider"></div>
      ${addCityForm}
      </div>
     </div>`);

    $('nav').append(`<button id='logout-btn' class='btn btn-danger' onclick="logout()">Logout</button>`);
}

function hideUserButtons(){
  $('#open-login-btn').show();
  $('#favorites-dropdown').remove();
  $("#logout-btn").remove();
}

function getUserFavorites(){
  let favoritesPath = '/api/v1/favorites'
  fetch(`http://${SERVER_PATH}${favoritesPath}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'Accept': 'application/json',
              'api_key': sessionStorage.getItem('key')
    }
   })
   // .then(response => response.json())
   .then(response => response.json())
   .then(function(reply){
     reply.data.forEach(function(element){
      let city = element.id;
        $('#favorites-dropdown-menu').prepend(`
          <a class="dropdown-item" href="javascript: populateFromFavorite('${city}')">${city}</a>
        `)
        $('#favorites-dropdown-menu').children('.disabled').remove()
     })
   })
   .catch(error => console.error(error))
}
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

  let icon = current["icon"];
  let summary = current["summary"];
  let feelsLike = current["apparentTemperature"];
  let humidity = current["humidity"];
  let visibility = current["visibility"];
  let uvIndex = current["uvIndex"];

  currentWeatherDetail = document.getElementById('current-weather-detail-container');
  let iconContainer = document.createElement('div');
  let summaryContainer = document.createElement('div');
  let feelsLikeContainer = document.createElement('div');
  let humidityContainer = document.createElement('div');
  let visibilityContainer = document.createElement('div');
  let uvIndexContainer = document.createElement('div');

  currentWeatherDetail.appendChild(iconContainer)
  currentWeatherDetail.appendChild(summaryContainer)
  currentWeatherDetail.appendChild(feelsLikeContainer)
  currentWeatherDetail.appendChild(humidityContainer)
  currentWeatherDetail.appendChild(visibilityContainer)
  currentWeatherDetail.appendChild(uvIndexContainer)

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
    buildWeatherHour(element);
  })
}

function buildWeatherHour(element){
  time = parseTime(element.time)

  $('#hourly-weather-container').append(
    `<div class=hour-container>
    <span>${time}</span>
    <span>${element.icon}</span>
    <span>${element.temperature}</span>
    </div>`
  )
}

function displayDailyWeather(element){
  data['attributes']['seven_day'].forEach(function(element){
    buildWeatherDay(element);
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
  return (new Date(unixTime*1000).toDateString());
}
