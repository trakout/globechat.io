import urllib2
import json
import datetime
import time
import calendar

from bottle import route, run, template, request

from config import TIME_API_KEY

IP_TO_CITY_API_URL = "http://ip-api.com/json/{0}"
WEATHER_API_LAT_LON_URL = "http://api.openweathermap.org/data/2.5/weather?lat={0}&lon={1}"
WEATHER_API_CITY_URL = "http://api.openweathermap.org/data/2.5/weather?q={0}"
TIME_URL = "https://maps.googleapis.com/maps/api/timezone/json?location={0},{1}&timestamp={2}&key={3}"
WEATHER_ICON_URL = "http://openweathermap.org/img/w/{0}.png"

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
        if 'main' in data and 'temp' in data['main']:
            user_information['temperature'] = convert_kelvin_to_celsius(data['main']['temp'])
        else:
            print "data[main] not found"
            print data

        if 'weather' in data and len(data['weather']) > 0 and 'description' in data['weather'][0] and 'id' in data['weather'][0] and 'icon' in data['weather'][0]:
            user_information['weather'] = data['weather'][0]['description']
            user_information['weather_id'] = data['weather'][0]['id']
            user_information['icon'] = WEATHER_ICON_URL.format(data['weather'][0]['icon'])
        else:
            print "data[weather] has missing details"
            print data
    
    return user_information

def get_location_details(ip):
    return fetch_data(IP_TO_CITY_API_URL.format(ip))

def dt(u): return datetime.datetime.utcfromtimestamp(u).strftime('%Y-%m-%d %H:%M:%S')

def get_local_time(location_details, user_information):
    if 'lat' in location_details and 'lon' in location_details:
        cur_time = calendar.timegm(time.gmtime())
        url = TIME_URL.format(location_details['lat'], location_details['lon'], cur_time, TIME_API_KEY)
        data = fetch_data(url)
        local_time = cur_time + data['dstOffset'] + data['rawOffset']
        user_information['local_time'] = dt(local_time)
    
    return user_information

def get_user_information(ip):
    user_information = {}

    location_details = get_location_details(ip)
    user_information = get_weather(location_details, user_information)
    user_information = get_local_time(location_details, user_information)
    
    return user_information

@route('/user_info/<ip>')
def index(ip):
    data = get_user_information(ip)
    return data

run(host='localhost', port=18081)
