
document.querySelector('#search').addEventListener('click', function (event) {
    event.preventDefault();
    const city = document.querySelector("#city_input").value.trim();

    if (city === "") {
        alert('Please enter a city name');
        return;
    }

    document.querySelector('#city_name').textContent = city;
    document.querySelector('#visible').style.display = 'block';


    fetchWeather(city);
});


function fetchWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=30f2012d158d45c9981141312250302&q=${encodeURIComponent(city)}&aqi=no`;

    console.log("Fetching weather for:", city);
    console.log("Request URL:", url);

    fetch(url)
        .then(response => {
            console.log("Response received:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Weather Data for City:", data);

            const { temp_c, temp_f, feelslike_c, precip_mm, wind_kph, humidity, vis_km } = data.current;

            document.querySelector('#card_temp_c').textContent = temp_c;
            document.querySelector('#card_prec').textContent = precip_mm;
            document.querySelector('#card_humidity').textContent = humidity;

            updateElementContent('temp_c', temp_c);
            updateElementContent('temp_f', temp_f);
            updateElementContent('feelslike_c', feelslike_c);
            updateElementContent('precip_mm', precip_mm);
            updateElementContent('wind_kph', wind_kph);
            updateElementContent('humidity', humidity);
            updateElementContent('vis_km', vis_km);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("City not found. Please enter a valid city name.");
        });
}


function updateElementContent(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content || "N/A";
    } else {
        console.warn(`Element with ID '${id}' not found.`);
    }
}


function fetchCityWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=30f2012d158d45c9981141312250302&q=${encodeURIComponent(city)}&aqi=no`;

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const { temp_c, temp_f, feelslike_c, gust_kph, humidity, vis_km } = data.current;
            return {
                city,
                temp_c,
                temp_f,
                feelslike_c,
                gust_kph,
                humidity,
                vis_km,
            };
        })
        .catch(error => {
            console.error(`Error fetching weather for ${city}:`, error);
            return null;
        });
}


async function populateWeatherTable() {
    const cities = ["Mumbai", "Norilsk", "London", "St Petersburg", "New York"];
    const tableBody = document.querySelector("#table_body");
    if (!tableBody) {
        console.error("Table body with id 'table_body' not found.");
        return;
    }

    tableBody.innerHTML = ""; 

    for (const city of cities) {
        console.log("Fetching weather for city:", city);
        const weatherData = await fetchCityWeather(city);

        if (weatherData) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${weatherData.city}</td>
                <td>${weatherData.feelslike_c || "N/A"}</td>
                <td>${weatherData.temp_f || "N/A"}</td>
                <td>${weatherData.gust_kph || "N/A"}</td>
                <td>${weatherData.humidity || "N/A"}</td>
                <td>${weatherData.temp_c || "N/A"}</td>
                <td>${weatherData.temp_f || "N/A"}</td>
                <td>${weatherData.vis_km || "N/A"}</td>`;
            tableBody.appendChild(row);
        } else {
            const errorRow = document.createElement("tr");
            errorRow.innerHTML = `
                <td>${city}</td>
                <td colspan="7">Error fetching data</td>`;
            tableBody.appendChild(errorRow);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const defaultCity = "Bombay";
    fetchWeather(defaultCity);

    document.querySelector('#city_name').textContent = defaultCity;
    document.querySelector('#visible').style.display = 'block';

    populateWeatherTable();  
});


