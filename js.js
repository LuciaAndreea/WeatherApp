const searchInput = document.querySelector(".search-input");
const API_KEY = "79493d26b5364e3fb1695446242211";

const getWeatherDetails = async (cityName) =>{
    const API_URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}`;

    try{
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log(data);
    } catch(error){
        console.log(error);
    }
}

//show the city on console when enter is clicked
searchInput.addEventListener("keyup" , (e) =>{
    // using trim() to remove extra whitespaces
    const cityName = searchInput.value.trim();

    if(e.key == "Enter" && cityName){
        getWeatherDetails(cityName);
    }
})