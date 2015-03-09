from flask import Flask, jsonify, request, Response
from flask.ext.script import Manager
from flask.ext.cors import CORS
from geopy.distance import vincenty
import pandas as pd
import io
import re
import requests


app = Flask(__name__, static_url_path='')
manager = Manager(app)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def load_data_from_S3():
    print('Loading data from S3...')

    url = 'https://s3-us-west-1.amazonaws.com/bike-parking/sf_bike_public_parking.csv'
    csv_str = requests.get(url).content
    csv_buffer = io.StringIO(unicode(csv_str, 'utf-8'))
    df = pd.read_csv(csv_buffer)
    lat_lng_series = df.COORDINATES.apply(parse_lat_long_values)
    df['LAT_LONG'] = lat_lng_series
    return df


def parse_lat_long_values(coord_str):
    RE = r'\((?P<lat>-?\d+\.\d+)\,\s*(?P<lng>-?\d+\.\d+)\)'
    m = re.search(RE, coord_str)
    if m and len(m.groups()) == 2:
        lat, lng = lat_lng_to_numeric(m.group('lat'), m.group('lng'))
    else:
        print('Unable to parse coordinates string: {}'.format(coord_str))
        lat, lng = None, None
    return (lat, lng)


def lat_lng_to_numeric(lat_str, lng_str):
    try:
        lat = float(lat_str)
        lng = float(lng_str)
    except:
        print('Unable to convert {}, {} to numeric values'.
              format(lat_str, lng_str))
        lat, lng = None, None
    return lat, lng


def lookup_nearest_spots(lat, lng, n):
    # Compute distance between user lat/lng and each bike parking lat/lng
    dists = bike_df['LAT_LONG'].apply(lambda x: vincenty(x, (lat, lng)).ft)

    # Sort distances in ascending order and select the first n values
    dists.sort()
    idx = dists.index.tolist()[:n]

    # Return entries as JSON records
    return bike_df.iloc[idx].to_json(orient='records')


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/api/bike_parking', methods=['GET'])
def find_nearest_bike_parking():
    # Extract params from URL
    lat_str = request.args.get('lat')
    lng_str = request.args.get('long')
    n = request.args.get('n')

    # Convert lat/lng to numeric values
    lat, lng = lat_lng_to_numeric(lat_str, lng_str)

    if lat is None or lng is None:
        return jsonify({'msg': 'Invalid lat/long data passed'}), 400

    # Convert n to numeric value
    if n is None:
        n = 1
    else:
        try:
            n = int(n)
        except:
            return None

    json_results = lookup_nearest_spots(lat, lng, n)
    response = Response(response=json_results, status=200,
                        mimetype='application/json')

    # Using Flask-Cors so shouldn't need this
    #response.headers['Access-Control-Allow-Origin'] = 'http://192.168.1.147:5000'

    return response


if __name__ == '__main__':

    bike_df = load_data_from_S3()
    manager.run()

