# Sweater Weather Frontend

A production version of this app can be found at https://prestonjarnagin.github.io/sweater-weather-frontend/

This is the front end counterpart of the [Sweater Weather Backend Project](https://github.com/prestonjarnagin/sweater_weather)

### Setup
* Clone down the repo, `cd` in
* Run `npm install`
* Run `npm start` to start a version of the server locally. Be default, this is configured to make api calls to the live version of the backend at https://sweater-weather-0.herokuapp.com/.
* Navigate to http://localhost:8080

### Configuration
The top of the `index.js` file contains global variables `SERVER_PATH` and `DEFAULT_CITY`
* `SERVER_PATH` points to the backend. To run the font end and backend locally, clone the backend repo, spin up the server locally, and set `SERVER_PATH` to its path, `http://localhost:3000` for example
* `DEFAULT_CITY` is the city the application will grab weather for upon page load.

### Built With

* [JavaScript](https://www.javascript.com/)
* [jQuery](https://jquery.com/)
* [Node](https://nodejs.org/)
