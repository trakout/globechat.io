##How to call
```
curl http://localhost:18080/en/de?string=hello%20world
```

Here, en is the from language; de is the to language; "hello world" is the string to be converted

Response will look like this:
```
{"code":200,"lang":"en-de","text":["Hallo Welt"]}
```

##How to start
python main.py

##Dependencies
* bottle

##Supported languages
* "ar": "Arabic",
* "az": "Azerbaijani",
* "be": "Belarusian",
* "bg": "Bulgarian",
* "bs": "Bosnian",
* "ca": "Catalan",
* "cs": "Czech",
* "da": "Danish",
* "de": "German",
* "el": "Greek",
* "en": "English",
* "es": "Spanish",
* "et": "Estonian",
* "fi": "Finnish",
* "fr": "French",
* "he": "Hebrew",
* "hr": "Croatian",
* "hu": "Hungarian",
* "hy": "Armenian",
* "id": "Indonesian",
* "is": "Icelandic",
* "it": "Italian",
* "ka": "Georgian",
* "lt": "Lithuanian",
* "lv": "Latvian",
* "mk": "Macedonian",
* "ms": "Malay",
* "mt": "Maltese",
* "nl": "Dutch",
* "no": "Norwegian",
* "pl": "Polish",
* "pt": "Portuguese",
* "ro": "Romanian",
* "ru": "Russian",
* "sk": "Slovak",
* "sl": "Slovenian",
* "sq": "Albanian",
* "sr": "Serbian",
* "sv": "Swedish",
* "th": "Thai",
* "tr": "Turkish",
* "uk": "Ukrainian",
* "vi": "Vietnamese",
* "zh": "Chinese"
