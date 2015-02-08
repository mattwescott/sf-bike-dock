from flask import Flask, render_template
from flask.ext.script import Manager
from flask.ext.bootstrap import Bootstrap
import pandas as pd
import boto
import io
import os


app = Flask(__name__)
bootstrap = Bootstrap(app)
manager = Manager(app)


def load_data_from_S3():
    print('Loading data from S3...')

    # Load the data from S3
    #https://s3-us-west-1.amazonaws.com/bike-parking/sf_bike_public_parking.csv
    s3_bucket = 'bike-parking'
    s3_key = 'sf_bike_public_parking.csv'

    if (os.environ.get('AWS_ACCESS_KEY_ID') and
        os.environ.get('AWS_SECRET_ACCESS_KEY')):
        # Read credentials from environment variables
        conn = boto.connect_s3()
    else:
        # Assume Nick is running the app, so read credentials from profile
        conn = boto.connect_s3(profile_name='nick')

    bucket = conn.get_bucket(s3_bucket)
    str_data = bucket.get_key(s3_key).get_contents_as_string()
    df = pd.read_csv(io.StringIO(unicode(str_data, 'utf-8')))
    return df


@app.route('/')
def index():
   return '<h1>Optimally dock your bike with BikeDocker(TM)</h1>'


if __name__ == '__main__':
    bike_df = load_data_from_S3()

    manager.run()

