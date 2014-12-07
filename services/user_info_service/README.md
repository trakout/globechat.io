##How to call
```
curl http://localhost:18081/user_info/209.29.24.147
```

Response will look like this:
```
{
    "city": "Toronto",
    "temperature": -1.9099999999999682,
    "country": "Canada",
    "weather_id": 800,
    "weather": "sky is clear",
    "local_time": "2014-12-07 14:21:31"
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
