from flask import Flask, jsonify, request, Response
from flask.ext.script import Manager
from geopy.distance import vincenty
import pandas as pd
import boto
import io
import re


app = Flask(__name__)
manager = Manager(app)


def load_data_from_S3():
    print('Loading data from S3...')

    # Load the data from S3
    #https://s3-us-west-1.amazonaws.com/bike-parking/sf_bike_public_parking.csv
    s3_bucket = 'bike-parking'
    s3_key = 'sf_bike_public_parking.csv'
    conn = boto.connect_s3()
    bucket = conn.get_bucket(s3_bucket)

    # Read text data from S3 bucket and convert to unicode
    str_data = bucket.get_key(s3_key).get_contents_as_string()
    str_data = io.StringIO(unicode(str_data, 'utf-8'))

    # Read string data into Pandas and parse lat/long values
    df = pd.read_csv(str_data)
    lat_lng_series = df['COORDINATES'].apply(parse_lat_long_values)
    df['LAT_LNG'] = lat_lng_series
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
    dists = bike_df['LAT_LNG'].apply(lambda x: vincenty(x, (lat, lng)).ft)

    # Sort distances in ascending order and select the first n values
    dists.sort()
    idx = dists.index.tolist()[:n]

    # Return entries as JSON
    return bike_df.iloc[idx].to_json()


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
            return jsonify({'msg': 'Invalid n value passed'}), 400

    json_results = lookup_nearest_spots(lat, lng, n)
    response = Response(response=json_results, status=200,
                        mimetype='application/json')
    response.headers['Access-Control-Allow-Origin'] = 'http://192.168.1.147:5000'

    return response


if __name__ == '__main__':
    bike_df = load_data_from_S3()

    manager.run()

