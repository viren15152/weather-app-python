from flask import Flask, render_template, jsonify, request
import os
from dotenv import load_dotenv
import requests

# Initialize Flask
app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Function to fetch current weather details
def get_weather(city):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_url = "http://api.openweathermap.org/data/2.5/weather?"
    complete_url = f"{base_url}q={city}&appid={api_key}&units=metric"
    response = requests.get(complete_url)

    if response.status_code == 200:
        data = response.json()
        main = data['main']
        weather = data['weather'][0]  # List of weather conditions
        icon_code = weather['icon']  # Get the icon code

        # Return current weather data, including the unit (°C)
        return {
            'temperature': main['temp'],
            'feels_like': main['feels_like'],
            'description': weather['description'],
            'icon_code': icon_code,
            'unit': '°C'  # Include unit for temperature
        }
    else:
        return None

# Function to fetch 5-day weather forecast
def get_forecast(city):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_url = "http://api.openweathermap.org/data/2.5/forecast?"
    complete_url = f"{base_url}q={city}&appid={api_key}&units=metric"
    response = requests.get(complete_url)

    if response.status_code == 200:
        data = response.json()
        forecast_data = []

        # Parse forecast data (5-day forecast, 3-hour intervals)
        for item in data['list'][::8]:  # Get one data point for each day (24-hour intervals)
            weather = item['weather'][0]
            icon_code = weather['icon']
            day_temp = item['main']['temp']
            night_temp = item['main']['temp_min']
            forecast_data.append({
                'day': item['dt_txt'].split()[0],  # Use date for the day
                'temp': f"{day_temp}°/{night_temp}°",  # Return temp with unit
                'icon_code': icon_code
            })

        return forecast_data
    else:
        return None

# Route to serve the main page
@app.route('/')
def home():
    return render_template('index.html')

# Route to get weather data via API
@app.route('/get_weather')
def weather():
    city = request.args.get('city')
    weather_data = get_weather(city)
    if weather_data:
        forecast_data = get_forecast(city)
        return jsonify({**weather_data, 'forecast': forecast_data})
    else:
        return jsonify({'success': False})

if __name__ == "__main__":
    app.run(debug=True)



