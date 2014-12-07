##How to call
```
curl http://localhost:18081/user_info/209.29.24.147
```

Response will look like this:
```
{
    "city": "Toronto",
    "weather": "few clouds",
    "temperature": 3.1200000000000045,
    "weather_id": 801,
    "country": "Canada"
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
