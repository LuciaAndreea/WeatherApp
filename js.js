const searchInput = document.querySelector(".search-input");
const locationButton = document.querySelector(".location-button");
const currentWeatherDiv = document.querySelector(".current-weather");
const hourlyWeatherDiv = document.querySelector(".hourly-weather .weather-list");
const API_KEY = "79493d26b5364e3fb1695446242211";

const weatherCodes = {
    clear: [1000],
    clouds: [1003, 1006, 1009],
    mist: [1030, 1135, 1147],
    rain: [1063, 1150, 1153, 1168, 1171, 1180, 1183, 1198, 1201, 1240, 1243, 1246, 1273, 1276],
    moderate_heavy_rain: [1186, 1189, 1192, 1195, 1243, 1246],
    snow: [1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264, 1279, 1282],
    thunder: [1087, 1279, 1282],
    thunder_rain: [1273, 1276],
}

const displayHourlyForecast = (hourlyData) =>{
    const currentHour = new Date().setMinutes(0,0,0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;

    const newxt24HoursData = hourlyData.filter(({ time }) =>{
        const forecastTime = new Date(time).getTime();
        return forecastTime >= currentHour && forecastTime <= next24Hours;
    });

    // generate HTML for every hour and display it
    hourlyWeatherDiv.innerHTML = newxt24HoursData.map(item =>{
        const temperature = Math.floor(item.temp_c);
        const time = item.time.split(" ")[1].substring(0, 5);
        const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(item.condition.code));

        return `<li class="weather-item">
                        <p class="time">${time}</p>
                        <img src="icons/${weatherIcon}.svg" class="weather-icon">
                        <p class="temperature">${temperature}°</p>
                    </li>`
    }).join("");
}

const getWeatherDetails = async (API_URL) =>{
    window.innerWidth <= 768 && searchInput.blur();
    document.body.classList.remove("show-no-result");

    try{
      const response = await fetch(API_URL);
      const data = await response.json();

      // Extract current weather details
      const temperature = Math.floor(data.current.temp_c); // remove the decimal point
      const description = data.current.condition.text;
      //Finds the key in weatherCodes that matches the item.conditon.code
      const weatherIcon = Object.keys(weatherCodes).find(icon => weatherCodes[icon].includes(data.current.condition.code));


      //Update the weather in real time
      currentWeatherDiv.querySelector(".weather-icon").src = `icons/${weatherIcon}.svg`;
      currentWeatherDiv.querySelector(".temperature").innerHTML = `${temperature}<span>°C</span>`;
      currentWeatherDiv.querySelector(".description").innerHTML = description;

      //Combine the hourly data for 2 days (today and tomorrow)
      const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
      displayHourlyForecast(combinedHourlyData);

      searchInput.value =data.location.name;
    } catch(error){
        document.body.classList.add("show-no-result");
    }
}

const setupWeatherRequest = (cityName) =>{
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=2`;
    getWeatherDetails(API_URL);
}

//show the city on console when enter is clicked
searchInput.addEventListener("keyup" , (e) =>{
    // using trim() to remove extra whitespaces
    const cityName = searchInput.value.trim();

    if(e.key == "Enter" && cityName){
       setupWeatherRequest(cityName)
    }
});

//Providing the users current geographic location
locationButton.addEventListener("click", () =>{
    navigator.geolocation.getCurrentPosition(position =>{
        const {latitude, longitude} = position.coords;
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
        getWeatherDetails(API_URL);
    }, error =>{
        alert("Location acces denied. Please enable permissions to use this feature.")
    });
});


setupWeatherRequest("bucharest");