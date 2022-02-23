// linked the modules to js file
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

// require template embedded js
const ejs = require("ejs");

// require https to access weather API
const https = require("https");

// to use express file
const app = express();

// type of errors
const err404 = "This country doesn't exist. Please try again!"
const otherError = "Something went wrong. Please try again!"

app.set("view engine", "ejs");

// to access the static (css and images )
app.use(express.static("static"));

// to use body-parser modules
app.use(bodyParser.urlencoded({
  extended: true
}));

// this is the original website shwon to the user
app.get("/", function(req, res) {
  res.render("home");
});

// to access the input data and weather profile API. Access the request sent by the user
app.post("/", function(req, res) {
  const location = req.body.cityName;
  const appID = "688b7c772d5ee92dd861f92d9618c9f3";
  const units = "standard";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + appID + "&units=" + units;


  // to get data from an external resource you use GET. check https module
  https.get(url, function(response) {

    // status code means different things. 200 means a ok and 404 means client made an error and 401 means the authentication is not allowed on API
    if (response.statusCode === 200) {
      response.on("data", function(data) {
        // setting variables for the data taken from weather API
        const weatherData = JSON.parse(data); // converting hexadecimal code to text
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        res.render("result", {
          location: _.upperFirst(location),
          temp: temp,
          weatherDescription: weatherDescription,
          imageURL: imageURL
        });
      });
    } else if (response.statusCode === 404) {
      res.render("failure", {
        error: err404
      });
    } else {
      res.render("failure", {
        error: otherError
      });
    };
  })
});


app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
