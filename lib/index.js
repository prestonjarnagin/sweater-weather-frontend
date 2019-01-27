// This file is in the entry point in your webpack config.
// process.env.api_url = "http://localhost:3000";

$('#confirm-login-btn').click(function(){
  let email = $('#email-formfield').val()
  let password = $('#password-formfield').val()
  login(email, password);
});

function login(email, password){
  let sessionPath = '/api/v1/sessions'
  fetch(`http://localhost:3000${sessionPath}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json',
              'Accept': 'application/json'
    },
    body: JSON.stringify({
      // "email": email,
      // "password": password,
      "email": 'preston@example.com',
      "password": ''
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

  loc = document.getElementById('weather-location-query')

  //Assuming incoming query is correctly formatted
  params = "?location="+loc.value
  oReq.open("GET", "http://localhost:3000/api/v1/forecast"+params);
  oReq.send();
}

function displayUserButtons(){
  $('#open-login-btn').hide();

  let addCityForm = `
  <form id="new-favorite-form" class="px-4 py-3">
    <div class="form-group">
      <label >Add a New City or Location</label>
      <input type="text" class="form-control" id="new-city-form" placeholder="Denver, CO">
    </div>
    <button type="submit" class="btn btn-primary">Add</button>
  </form>
  `
  $('nav').append(
    `<div class="btn-group dropleft id="favorites-dropdown">
      <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Favorites
      </button>
      <div class="dropdown-menu" id="favorites-dropdown-menu">
        <a class="dropdown-item disabled" href="#">Loading Favorites</a>
      <div class="dropdown-divider"></div>
      ${addCityForm}
      </div>
     </div>`);

    $('nav').append(`<button id='logout-btn' class='btn btn-danger'>Logout</button>`);

}

function getUserFavorites(){
  let favoritesPath = '/api/v1/favorites'
  fetch(`http://localhost:3000${favoritesPath}`, {
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
          <a class="dropdown-item" href="#">${city}</a>
        `)
        $('#favorites-dropdown-menu').children('.disabled').hide()
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

  // Add let here. These are currently globally scoped
  icon = current["icon"];
  summary = current["summary"];
  feelsLike = current["apparentTemperature"];
  humidity = current["humidity"];
  visibility = current["visibility"];
  uvIndex = current["uvIndex"];

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
