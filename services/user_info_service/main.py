import urllib2
import json

from bottle import route, run, template, request

IP_TO_CITY_API_URL = "http://ip-api.com/json/{0}"
WEATHER_API_LAT_LON_URL = "http://api.openweathermap.org/data/2.5/weather?lat={0}&lon={1}"
WEATHER_API_CITY_URL = "http://api.openweathermap.org/data/2.5/weather?q={0}"

def convert_kelvin_to_celsius(kelvin):
    return kelvin - 273.15

def fetch_data(url):
    req = urllib2.urlopen(url)
    return json.loads(req.read())

def get_weather(location_details, user_information):
    data = None

    if 'lat' in location_details and 'lon' in location_details:
        data = fetch_data(WEATHER_API_LAT_LON_URL.format(location_details['lat'], location_details['lon']))
    
    if 'city' in location_details and 'country' in location_details:
        user_information['city'] = location_details['city']
        user_information['country'] = location_details['country']
        data = fetch_data(WEATHER_API_CITY_URL.format(location_details['city']))
    
    if data:
        user_information['temperature'] = convert_kelvin_to_celsius(data['main']['temp'])
        user_information['weather'] = data['weather'][0]['main']
    
    return user_information

def get_location_details(ip):
    return fetch_data(IP_TO_CITY_API_URL.format(ip))

def get_user_information(ip):
    user_information = {}

    location_details = get_location_details(ip)
    user_information = get_weather(location_details, user_information)
    
    return user_information

@route('/user_info/<ip>')
def index(ip):
    data = get_user_information(ip)
    return data

run(host='localhost', port=18081)
