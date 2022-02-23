// linked the modules to js file
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


// to use express file
const app = express();


// to access the static (css and images )
app.use(express.static("static"));

// to use body-parser modules
app.use(bodyParser.urlencoded({
  extended: true
}));

// this is the original website shwon to the user
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/");
});

// to access the input data and weather profile API. Access the request sent by the user
app.post("/", function(req, res) {
  const location = req.body.cityName;
  const appID = "688b7c772d5ee92dd861f92d9618c9f3";
  const units = "metric";
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
        res.sendFile(__dirname + "/result.html");

        });


        // res.write("<h1>The temperature in " + location + " is currently " + temp + " degrees Celcius</h1>");
        // res.write("<h2>Right now there is " + weatherDescription + "</h2>");
        // res.write("<img src=" + imageURL + ">");
        // res.send();
      })
    } else {
      res.sendFile(__dirname + "/failure.html");
    };
  })
});

// to replace text in results page to show for each Location
// $(".title").click(function() {
//   $(".title").text("IT'S GOING TO WORK!");
// })
// $(".weather-temp").text($(".weather-temp").text().replace("location", location));

// Using the .load() callback function, this will replace the text in question with a span containing the text, that you can then alter using css...





app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
