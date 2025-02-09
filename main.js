let searchBtn = document.querySelector(".search");
let weatherDisplay = document.querySelector(".todays-weather");
let forecastCards = document.querySelectorAll(".forecastDisplay .col-md");

// I had to rely on code copilot to help me format how the code is organized below. I couldnt get things to work properly alone. 
// I mostly struggled on the fetch API and then manipulating/formating the data that was fetched. But I understand how it works

searchBtn.addEventListener("click", function () {
    let userInput = document.querySelector(".city-input").value.trim();
    document.querySelector(".city-input").value = ""; 

    if (!userInput) {
        alert("Please enter a city name!");
        return;
    }

    const fetchCordinates = (userInput) => {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=5fcdd42d3867910bc60aa5df701c10d9`;
        return fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                return {
                    Lat: data[0].lat,
                    Lon: data[0].lon,
                };
            });
    };

    fetchCordinates(userInput)
        .then(cordinates => {
            getCurrWeather(cordinates);
            return getForecast(cordinates); 
        })
        .then(forecastData => {
            updateForecastDisplay(forecastData);
        });

    const getCurrWeather = (cordinates) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cordinates.Lat}&lon=${cordinates.Lon}&appid=5fcdd42d3867910bc60aa5df701c10d9`;
        fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                let weatherData = {
                    Name: data.name,
                    Temp: ((data.main.temp - 273.15) * 9 / 5 + 32).toFixed(1),
                    Description: data.weather[0].description,
                };
                updateWeatherDisplay(weatherData);
            });
    };

    const getForecast = (cordinates) => {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cordinates.Lat}&lon=${cordinates.Lon}&appid=5fcdd42d3867910bc60aa5df701c10d9`;
        return fetch(url, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                let dailyForecasts = {};
                
                data.list.forEach(entry => {
                    let date = new Date(entry.dt * 1000).toLocaleDateString("en-US", { weekday: "long" });
                    
                    if (!dailyForecasts[date] && entry.dt_txt.includes("12:00:00")) { 
                        dailyForecasts[date] = {
                            Temp: ((entry.main.temp - 273.15) * 9 / 5 + 32).toFixed(1),
                            Description: entry.weather[0].description
                        };
                    }
                });

                return dailyForecasts;
            });
    };

    const updateWeatherDisplay = (weatherData) => {
        weatherDisplay.innerHTML = `
            <h1>${weatherData.Name}</h2>
            <p><strong>${weatherData.Temp}°F</strong></p>
            <p>${weatherData.Description}</p>
        `;
    };

    const updateForecastDisplay = (forecastData) => {
        let days = Object.keys(forecastData);
        
        forecastCards.forEach((card, index) => {
            if (index < days.length) {
                let forecast = forecastData[days[index]];
                card.querySelector("h4 strong").textContent = days[index]; 
                card.querySelector(".weather-info h3 strong").textContent = `${forecast.Temp}°F`; 
            }
        });
    };
});




