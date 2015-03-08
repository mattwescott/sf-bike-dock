import os
import io
import re

import requests

import pandas as pd

from flask import Flask, render_template
from flask.ext.script import Manager
from flask.ext.bootstrap import Bootstrap


app = Flask(__name__)
bootstrap = Bootstrap(app)
manager = Manager(app)


def load_data_from_S3():
    print('Loading data from S3...')

    url = 'https://s3-us-west-1.amazonaws.com/bike-parking/sf_bike_public_parking.csv'
    csv_str = requests.get(url).content
    csv_buffer = io.StringIO(unicode(csv_str, 'utf-8'))
    df = pd.read_csv(csv_buffer)
    lat_lng_values = df.COORDINATES.apply(parse_lat_long_values, axis=0)

def parse_lat_long_values(coord_str, axis):
    RE = r'\((?P<lat>-?\d+\.\d+)\,\s*(?P<lng>-?\d+\.\d+)\)'
    m = re.search(RE, coord_str)
    if m and len(m.groups()) == 2:
        lat, lng = lat_lng_to_numeric(m.group('lat'), m.group('lng'))
        return (lat, lng)
    else:
        print('Unable to parse coordinates string: {}'.format(coord_str))
        return (None, None)

def lat_lng_to_numeric(lat_str, lng_str):
    try:
        lat = float(lat_str)
        lng = float(lng_str)
    except:
        print('Unable to convert {}, {} to numeric values'.
              format(lat_str, lng_str))
        lat, lng = None, None
    return lat, lng


@app.route('/')
def index():
   return '<h1>Optimally dock your bike with BikeDocker(TM)</h1>'


@app.route('/bike_parking', methods=['GET'])
def find_nearest_bike_parking():
    # Extract params from URL
    lat_str = request.args.get('lat')
    lng_str = request.args.get('long')
    n = request.args.get('n')

    lat, lng = lat_lng_to_numeric(lat_str, lng_str)

    if lat is None or lng is None:
        return

    if n is None:
        n = 1
    else:
        try:
            n = int(n)
        except:
            return None

    return jsonify(lookup_nearest_spots(lat, lng, n))


#def lookup_nearest_spots(lat, lng, n):



if __name__ == '__main__':

    bike_df = load_data_from_S3()
    manager.run()

