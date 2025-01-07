const searchInput = document.querySelector(".search-input");

//show the city on console when enter is clicked
searchInput.addEventListener("keyup" , (e) =>{
    // using trim() to remove extra whitespaces
    const cityName = searchInput.value.trim();

    if(e.key == "Enter" && cityName){
        console.log(cityName);
    }
})