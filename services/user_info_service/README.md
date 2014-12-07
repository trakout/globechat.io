##How to call
```
curl http://localhost:18081/user_info/209.29.24.147
```

Response will look like this:
```
{
    "city": "Toronto",
    "temperature": -3.769999999999982,
    "country": "Canada",
    "weather_id": 803,
    "weather": "broken clouds",
    "local_time": "2014-12-07 18:09:58",
    "icon": "http://openweathermap.org/img/w/04n.png"
}
```
The weather_id corresponds to the codes found on [this page](http://bugs.openweathermap.org/projects/api/wiki/Weather_Condition_Codes)

If city is not found, you could get something like this:
```
{
    "city": "",
    "country": "Thailand"
}
```


##How to start
python main.py

##Dependencies
* bottle

##How to install dependencies on mac
```
easy_install pip
pip install bottle
```
