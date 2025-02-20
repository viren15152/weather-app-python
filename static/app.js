let map; // Global variable for the map instance

document.getElementById("getWeather").addEventListener("click", function () {
    const city = document.getElementById("city").value;

    // Check if city input is empty
    if (city.trim() === "") {
        alert("Please enter a city name.");
        return;
    }

    // Clear previous weather info and map before new search
    document.getElementById("weatherInfo").style.display = "none";
    document.getElementById("map").innerHTML = "";  // Clear previous map content
    document.getElementById("errorMessage").style.display = "none";  // Hide error message
    document.getElementById("forecast").innerHTML = ""; // Clear forecast section

    // Fetch new weather data
    fetch(`/get_weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.success !== false) {
                // Show the weather info
                document.getElementById("errorMessage").style.display = "none";
                document.getElementById("weatherInfo").style.display = "block";
                document.getElementById("currentTemp").textContent = `${data.temperature} ${data.unit}`; // Update temperature

                // Display the city name above the temperature
                document.getElementById("cityName").textContent = city;

                // Properly capitalize the description
                const formattedDescription = capitalizeDescription(data.description);
                document.getElementById("description").textContent = formattedDescription;

                document.getElementById("feelsLike").textContent = `Feels like ${data.feels_like} ${data.unit}`;

                // Dynamically set the weather icon based on icon_code
                const iconUrl = `http://openweathermap.org/img/wn/${data.icon_code}@2x.png`;
                document.getElementById("weatherIcon").src = iconUrl;

                // Display the 5-day forecast dynamically
                const forecastDiv = document.getElementById("forecast");
                forecastDiv.innerHTML = "";  // Clear previous forecast data

                data.forecast.forEach(day => {
                    const dayDiv = document.createElement("div");
                    dayDiv.className = "forecast-card"; // Add a class for styling

                    // Format the date to UK format (DD/MM/YYYY)
                    const formattedDate = formatDateToUK(day.day);

                    const forecastIconUrl = `http://openweathermap.org/img/wn/${day.icon_code}@2x.png`;
                    const forecastClass = getIconClass(day.icon_code);

                    dayDiv.innerHTML = `
                        <p>${formattedDate}</p>
                        <p>${day.temp}</p>
                        <img src="${forecastIconUrl}" alt="${day.day}" class="${forecastClass}" />
                    `;
                    forecastDiv.appendChild(dayDiv);
                });

                // Add map after weather data is fetched
                displayMap(data.lat, data.lon, city);
            } else {
                // Show error message if city not found
                document.getElementById("errorMessage").style.display = "block";
                document.getElementById("weatherInfo").style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            document.getElementById("errorMessage").style.display = "block";
            document.getElementById("weatherInfo").style.display = "none";
        });
});

// Function to capitalize description correctly
function capitalizeDescription(description) {
    return description
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Function to format date to UK format (DD/MM/YYYY) and get full weekday name
function formatDateToUK(dateString) {
    const date = new Date(dateString);

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = weekdays[date.getDay()];

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${dayOfWeek}, ${day}/${month}/${year}`;
}

// Function to get the correct class based on the weather icon
function getIconClass(iconCode) {
    if (iconCode.includes("01d")) {
        return "sunny";
    } else if (iconCode.includes("02d") || iconCode.includes("03d")) {
        return "cloudy";
    } else if (iconCode.includes("09d") || iconCode.includes("10d")) {
        return "rainy";
    }
    return "";
}

// Function to add a map after weather data is fetched
function displayMap(lat, lon, city) {
    // If map already exists, remove it and create a new one
    if (map) {
        map.remove();  // Remove existing map
    }

    const mapDiv = document.getElementById("map");
    mapDiv.innerHTML = ""; // Clear previous map content

    // Initialize the new map
    map = L.map(mapDiv).setView([lat, lon], 10); // Default zoom level and coordinates

    // Add OpenStreetMap base layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker to the map
    L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${city}</b><br>Weather: ${city}`)
        .openPopup();
}















