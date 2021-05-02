var searchButton = document.getElementById("search-button");
var cityNameSearch = document.getElementById("city-name");
var cityNameToday = document.getElementById("city-today");
var uvIndex = document.getElementById("uv-index");
var todaysWeather = document.querySelector("todays-weather");
var searchHistory = document.getElementById("search-history");
var string = [];

//function to receive searc value and fush to other functions
function submitNameSearch(event){

    $("#future-forecast").html("");
    
    var cityName = cityNameSearch.value.trim();

    if (cityName){
        searchWeather(cityName);
        cityNameToday.textContent = cityName + moment().format("(MM/DD/YYYY)");
        cityNameSearch.value = "";
    }else{
        alert("Please enter a valid city name");
    }

    //set search history to local storage 
    
    string.push(cityName);
    localStorage.setItem("searchHistoryList", JSON.stringify(string));
    
    //var history = JSON.parse(localStorage.getItem("searchHistoryList"))
    searchHistory.innerHTML = "";
    string.forEach(function(item){
        var historyList = document.createElement("li");
        historyList.textContent = item;
        historyList.classList.add("flex-row", "justify-space-between", "align-center", "search-list");
        searchHistory.appendChild(historyList);
        historyList.addEventListener("click", function() {
            historyNameSearch(item);
        })
        console.log("hello");

    })


}



function historyNameSearch(searchCity){
    searchWeather(searchCity);
    cityNameToday.textContent = searchCity + moment().format("(MM/DD/YYYY)");
}
//create event listener for click of <li> 
//does the same thing as submitNameSearch, but takes search history name instead of input name

//api to pull current weather conditions
function searchWeather(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6d97afac271bf76bda029031ba851c8a&units=imperial";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            //uv index
            getUvIndex(data.coord.lat, data.coord.lon);
            getForecast(city);
            console.log(data, city);
            $("#icon").attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png");
            $("#temperature").text(data.main.humidity);
            $("#wind").text(data.wind.speed);
            $("#humidity").text(data.main.temp);
        });
    });
};

//api to find UV index and assign color
function getUvIndex(latitude, longitude){
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=6d97afac271bf76bda029031ba851c8a";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data.value);
            uvIndex.textContent = data.value;

            if (uvIndex.textContent < 3){
                uvIndex.setAttribute("style", "background-color:green;");
            } else if(uvIndex.textContent < 6){
                uvIndex.setAttribute("style", "background-color:yellow;");
            } else if(uvIndex.textContent < 8){
                uvIndex.setAttribute("style", "background-color:orange;");
            }else{
                uvIndex.setAttribute("style", "background-color:red;");
            }
        });
    });
}

//api to pull 5 day forecast and display dynamically
function getForecast(searchValue){

    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=6d97afac271bf76bda029031ba851c8a&units=imperial";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            //uv index
            console.log("hello", data);
            for (var i = 5; i < 40; i += 8){
                $("#future-forecast").append(`
                <div class="card col-2 future-day">
                    <h6 class="future-date" style="float: left;"></h6>
                    <img class="future-icon" src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
                    <hr>
                    <ul>
                        <li>Temp: ${data.list[i].main.temp}&#176</li>
                        <li>Wind: ${data.list[i].wind.speed} mph</li>
                        <li>Humidity: ${data.list[i].main.humidity}%</li>
                    </ul>
                </div>
                `)
               
            }
            for (var x = 1; x <= 5; x++){
                $(".future-date").eq(x - 1).text(moment().add([x], "d").format("(MM/DD/YYYY)"));
                console.log($(".future-date").text());
            }
        });

    });
}


//event listener for button click when city is submitted through input element
searchButton.addEventListener("click", function(){   
    //calls function that searches using input and saves to local storage
    submitNameSearch();
});

//event listener for when user clicks city from search history 
// searchHistory.addEventListener("click", function(){
//     //calls function that searches using city from  history list
//     historyNameSearch();
// })
