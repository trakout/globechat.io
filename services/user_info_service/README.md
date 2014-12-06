##How to call
```
curl http://localhost:18081/user_info/209.29.24.147
```

Here, en is the from language; de is the to language; "hello world" is the string to be converted

Response will look like this:
```
{
    "city": "Toronto",
    "weather": "Clouds",
    "temperature": 3.7100000000000364,
    "country": "Canada"
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
