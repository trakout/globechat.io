import urllib2
import json
import re

from bottle import route, run, template, request

from config import API_KEY

YANDEX_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key={0}&lang={1}-{2}&text={3}'

def get_info_from_yandex(source_lang, dest_lang, string):
    url = YANDEX_URL.format(API_KEY, source_lang, dest_lang, string)
    print url
    yandex_request = urllib2.urlopen(url)
    data = yandex_request.read()
    return data

@route('/<source_lang>/<dest_lang>')
def index(source_lang, dest_lang):
    raw_string = request.query['string']
    string = re.sub(' +', '+', raw_string)
    data = get_info_from_yandex(source_lang, dest_lang, string)
    return data

run(host='localhost', port=18080)
