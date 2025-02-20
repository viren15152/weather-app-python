from flask import Flask, render_template, jsonify, request
import os
from dotenv import load_dotenv
import requests

# Initialize Flask
app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()

# Function to fetch weather details
def get_weather(city):
    api_key = os.getenv("OPENWEATHER_API_KEY")
    base_url = "http://api.openweathermap.org/data/2.5/weather?"
    complete_url = f"{base_url}q={city}&appid={api_key}&units=metric"
    response = requests.get(complete_url)
    if response.status_code == 200:
        data = response.json()
        main = data['main']
        weather = data['weather'][0]
        return {
            'temperature': main['temp'],
            'pressure': main['pressure'],
            'humidity': main['humidity'],
            'description': weather['description']
        }
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
        return jsonify(weather_data)
    else:
        return jsonify({'success': False})

if __name__ == "__main__":
    app.run(debug=True)
