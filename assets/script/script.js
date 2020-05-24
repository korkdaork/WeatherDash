$(document).ready(function () {

    //onclick search button

    $("#searchBtn").on("click", function () {

        //search input value - originally had var but changed to const
        const searchValue = $("#inputValue").val().trim();

        //call search weather function and pass the search value -- see code above --
        searchWeather(searchValue);

        //adds history search in button format
        searchHistoryBtn(searchValue);

        // ========================================= Save to Local Storage =============================================================

        //indentify user input
        const userInput = $(this).siblings("#inputValue").val().trim();

        //save information in local storage
        localStorage.setItem(searchValue, userInput);

    });

    //================================================================ CURRENT WEATHER FUNCTION =======================================================
    function searchWeather(searchCity) {

        //Clear out the information in the today DIV - we put it before the rest of code in order to clear out everything prior to attaching.
        $("#today").empty();

        //API key - 03372b05683f32ca6f14fa043c2663ff
        var APIKey = "03372b05683f32ca6f14fa043c2663ff";

        // Building the URL needed to query the database for city - weather
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=imperial&appid=` + APIKey;



        // Run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // Store all of the retrieved data inside of an object called "response"
            .then(function (response) {

                //======================================== DATA EXTRACT VARIABLES ===================================================

                //City Name
                var cityName = response.name;
                //Wind Speed
                var wind = response.wind.speed;
                //Humidity Level
                var humidity = response.main.humidity;
                //Temperature
                var temperature = response.main.temp;
                //Image/Icon
                var image = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`; //THANK YOU JUSTIN FOR YOUR VIDEO - I COULDN'T FIGURE OUT HOW TO GET THE IMAGE WORKING!!111!!11!

                //======================================== CARD CREATION CLUB!1! ============================================================

                //creates a h3 element with a bootstrap class of card title with city name and the local date
                var titleEl = $("<h3>").addClass("card-title").text(`${cityName} (${new Date().toLocaleDateString()})`);

                //adding card - div w/ class of card.
                var cardEl = $("<div>").addClass("card");

                //create card body in the new div - bootstrap to the rescue!
                var cardBodyEl = $("<div>").addClass("card-body");

                //Adding wind element to the card
                var windEl = $("<p>").addClass("card-text").text(`Wind Speed: ${wind} mps`);

                //Adding humidity element to the card
                var humidEl = $("<p>").addClass("card-text").text(`Humidity: ${humidity}%`);

                //Adding temperature tot he card element
                var tempEl = $("<p>").addClass("card-text").text(`Temperature: ${temperature} degrees`);

                //Inserting img attribute
                var imgEl = $("<img>").attr("src", image);

                //======================================= APPENDING FOR THE WIN ===========================================================

                //Appending Data to the Card
                titleEl.append(imgEl);

                cardBodyEl.append(titleEl, tempEl, humidEl, windEl);

                cardEl.append(cardBodyEl);

                //append card
                $("#today").append(cardEl);

                //get latitude 
                var latitude = response.coord.lat;

                //get longitude
                var longitude = response.coord.lon;

                getUVIndex(latitude, longitude);
                getForecast(searchCity);

            });

    };

    //========================================================= UV INDEX FUNCTION =====================================================================

    function getUVIndex(latitude, longitude) {

        var APIKey = "03372b05683f32ca6f14fa043c2663ff"
        var queryURLUV = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${latitude}&lon=${longitude}`

        // Run AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURLUV,
            method: "GET"

            // Store all of the retrieved data inside of an object called "response"
        }).then(function (response) {

            //UV value variable
            var uvValue = response.value;

            //<p> tag to append to the card above
            var uvEl = $("<p>").text(`UV Index: `)

            //button added to represent UV Value
            var btnEl = $("<span>").addClass("btn btn-sm").text(uvValue);

            //if else statements to change colors based on UV value.
            if (uvValue < 3) {
                btnEl.addClass("btn-success");
            }

            else if (uvValue < 7) {
                btnEl.addClass("btn-warning");
            }

            else {
                btnEl.addClass("btn-danger");
            }

            //appending button
            uvEl.append(btnEl);

            //appending to card
            $("#today .card-body").append(uvEl);

        })

    };

    //============================================================= FORECAST FUNCTION =======================================================================

    function getForecast(searchCity) {

        var APIKey = "03372b05683f32ca6f14fa043c2663ff"
        var queryURLForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=imperial&appid=${APIKey}`

        $("#forecast").empty();

        // Run AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURLForecast,
            method: "GET"

            // Store all of the retrieved data inside of an object called "response"
        }).then(function (response) {

            //======================================================= APPENDING FOR THE WIN!1!!11!! ================================================================

            //target forecast and insert elements and append a row. >>>>...\"mt-3\"...<<< (the two backslashes allow for scaping and inserting additional class)
            $("#forecast").html("<h4 class\"mt-3\">5-day Forcast: </h4>").append("<div>")

            //append columns throguh a loop w/ variable creation club  //i<response.list.length; i+=8 <Justin's solution.  Working on other possible solutions.
            for (var i = 0; i < response.list.length; i += 8) {

                //create column
                var colEl = $("<div>").addClass("col-md-2 forecastCard")

                //adding card - div w/ class of card.
                var cardEl = $("<div>").addClass("card bg-primary text-white");

                //create card body in the new div - bootstrap to the rescue!
                var cardBodyEl = $("<div>").addClass("card-body p-2");

                //data extraction and insertion
                var titleEl = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());

                //adding that icon image WOOOOTTTT
                // var image = `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`;
                var imgEl = $("<img>").attr("src", `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`);

                //temperature element min and max
                var tempElMin = $("<p>").addClass("card-text").text(`Minimum Temp: ${response.list[i].main.temp_min} degrees`);
                var tempElMax = $("<p>").addClass("card-text").text(`Maximum Temp: ${response.list[i].main.temp_max} degrees`);

                //humidity level
                var humidityEl = $("<p>").addClass("card-text").text(`Humidity: ${response.list[i].main.humidity} %`);

                //appending elements to card body and body to card.
                cardBodyEl.append(titleEl, imgEl, tempElMin, tempElMax, humidityEl);
                cardEl.append(cardBodyEl);

                //appending card element to column element
                colEl.append(cardEl);

                //appending column to the forecast div.
                $("#forecast").append(colEl);

            };

        });

    };

    //=============================================================== SEARCH HISTORY BUTTONS ============================================================

    function searchHistoryBtn(searchValue) {

        // var searchValue = $("#inputValue").val().trim();

        var citySearchBox = $("#city-search-box");

        var cityBtnDivEl = $("<div>").addClass("col-md-2 cityBtn");

        var cityBtnEl = $("<button>").addClass("btn btn-primary btn-lg").text(searchValue);

        $(cityBtnDivEl).append(cityBtnEl);

        $(citySearchBox).append(cityBtnDivEl);



        $(cityBtnEl).on("click", function () {

            var getCity = localStorage.getItem(searchValue)
            searchWeather(getCity);

        });

    };


});