var weatherAPI = "81bba03d80a285cb4521ac469ecbb174";
var cityDetailContainer = $('#weather-container');
var searchButton = $('#button-addon2');
var forecastContainer = $('#day-forecast');
//need to add DATE in still

// let city = '';
// let searchBtn = $('#button-addon2');
// searchBtn.on('click', function() {
//     let city = $('#newCity').val().toLowerCase();
//     getData(city)
// })

//function to get the current weather for a city 
// function currentWeather(city) {
//     var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${weatherAPI}`
//     $.ajax({
//         url: queryURL,
//         method: 'GET',
//     }).then(function(currentCityWeather) {
//         console.log(currentCityWeather);

//         $('#weatherDisplayData').css("display", "block");
//         $('#cityDeails').empty();

//     });
// }

//function to display the weather 
function getData(city) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherAPI}`
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            //create h3 element for city name an p elements for displaying info 
            const cityName = $("<h3>");
            const cityTemp = $("<p>");
            const cityHumidity = $("<p>");
            const cityWind = $("<p>");
            //setting the text of h3 and p
            cityName.text(data.name)
            cityTemp.text('Tempterature: ' + data.main.temp + 'C')
            cityHumidity.text('Humidity: ' + data.main.humidity + '%')
            cityWind.text('Wind Speed: ' + data.wind.speed + 'Km/h')
                //Appending the dynamically generated html to the div associated with the id="users"
                //Append will attach the element as the bottom most child.
            cityDetailContainer.append(cityName);
            cityDetailContainer.append(cityTemp)
            cityDetailContainer.append(cityHumidity);
            cityDetailContainer.append(cityWind);

            //setting the data for uv index, need lon and lat
            let lon = data.coord.lon;
            let lat = data.coord.lat;
            uvIndexData(lon, lat)


        });
    // searchButton.on('click', getData);
}


//function to display UV index: 
function uvIndexData(lon, lat) {
    var uvAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherAPI}`
    fetch(uvAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // console.log(data)
            console.log(data.current.uvi);

            //create p element to display UVI
            const uvi = $("<p class='uvIndex'>");
            let uvScale = $("<div class='index-scale'>") // create div for uv scale
            //set the text 
            uvi.text('UV Index: ' + data.current.uvi)
                //append to correct locatoin
            cityDetailContainer.append(uvi);

            // If statement to check the uv index and colour the indicator accordingly
            if (data.current.uvi <= 2) {
                // console.log('low')
                uvScale.addClass('low');
            } else if(data.current.uvi > 2 && data.current.uvi <= 5) {
                // console.log('medium')
                uvScale.addClass('medium');
            } else if(data.current.uvi > 5 && data.current.uvi <= 7) {
                // console.log('high')
                uvScale.addClass('high')
            } else if(data.current.uvi > 7 && data.current.uvi <= 10) {
                // console.log('very-high')
                uvScale.addClass('very-high')
            } else {
                // console.log('dangerous')
                uvScale.addClass('dangerous')
            }
            uvi.after(uvScale);
        })
}

//create function for 5 day forecast. 
function fiveDayForecast(city) {
    var forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${weatherAPI}`
    fetch(forecast)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            
            let count = 0; // start a count to increment with each forecast day
            for (var i = 0; i < data.list.length; i++) {
                var dayData = data.list[i]
                if (dayData.dt_txt.includes("15:00")) {
                    
                    count ++; //increment counter
                    // create each section to append daily weather details
                    let weatherCol = $(`
                        <div class="col" id="day-forecast">
                            <h4>Day ${count} of Forecast</h4>
                            <p><strong>Temperature:</strong> ${dayData.main.temp}</p>
                            <p><strong>Humidity:</strong> ${dayData.main.humidity}</p>
                            <p><strong>Wind Speed:</strong> ${dayData.wind.speed}</p>
                        </div>
                    `);
                    $('.weather').append(weatherCol); // Append weather div to weather row
                }
            }
        })
}
// run each function on button click
let searchBtn = $('#button-addon2');
searchBtn.on('click', function() {
    let city = $('#newCity').val().toLowerCase();
    fiveDayForecast(city)
    getData(city);
})
// fiveDayForecast('adelaide');


//Call functions
// currentWeather('adelaide');
// getData();