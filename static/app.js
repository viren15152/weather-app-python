document.getElementById("getWeather").addEventListener("click", function() {
    const city = document.getElementById("city").value;

    if (city.trim() === "") {
        alert("Please enter a city name.");
        return;
    }

    fetch(`/get_weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.success !== false) {
                // Hide the error message and show weather info
                document.getElementById("errorMessage").style.display = "none";
                document.getElementById("weatherInfo").style.display = "block";
                document.getElementById("currentTemp").textContent = `${data.temperature} ${data.unit}`; // Append the unit (°C)
                
                // Properly capitalize the description
                const formattedDescription = capitalizeDescription(data.description);
                document.getElementById("description").textContent = formattedDescription;

                document.getElementById("feelsLike").textContent = `Feels like ${data.feels_like} ${data.unit}`; // Append the unit (°C)

                // Dynamically set the weather icon based on icon_code
                const iconUrl = `http://openweathermap.org/img/wn/${data.icon_code}@2x.png`;
                document.getElementById("weatherIcon").src = iconUrl;

                // Display the 5-day forecast dynamically
                const forecastDiv = document.getElementById("forecast");
                forecastDiv.innerHTML = "";  // Clear any existing forecast data

                data.forecast.forEach(day => {
                    const dayDiv = document.createElement("div");
                    dayDiv.className = "forecast-card"; // Add a class for styling

                    // Format the date to UK format (DD/MM/YYYY)
                    const formattedDate = formatDateToUK(day.day);
                    
                    const forecastIconUrl = `http://openweathermap.org/img/wn/${day.icon_code}@2x.png`;
                    const forecastClass = getIconClass(day.icon_code);

                    dayDiv.innerHTML = `
                        <p>${formattedDate}</p> <!-- Display date in UK format -->
                        <p>${day.temp}</p>
                        <img src="${forecastIconUrl}" alt="${day.day}" class="${forecastClass}" />
                    `;
                    forecastDiv.appendChild(dayDiv);
                });

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
    // Split the description into words, capitalize each word, and join back
    return description
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Function to format date to UK format (DD/MM/YYYY) and get full weekday name
function formatDateToUK(dateString) {
    const date = new Date(dateString); // Parse the date string into a Date object

    // Get full weekday name (e.g., Monday)
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = weekdays[date.getDay()]; // Get full name of the weekday

    const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero if necessary
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
    const year = date.getFullYear(); // Get the full year

    return `${dayOfWeek}, ${day}/${month}/${year}`; // Return full weekday name + date in DD/MM/YYYY format
}

// Function to get the correct class based on the weather icon
function getIconClass(iconCode) {
    if (iconCode.includes("01d")) {
        return "sunny"; // Add the sunny class for the sunny icons
    } else if (iconCode.includes("02d") || iconCode.includes("03d")) {
        return "cloudy"; // Add the cloudy class
    } else if (iconCode.includes("09d") || iconCode.includes("10d")) {
        return "rainy"; // Add the rainy class
    }
    return "";
}





