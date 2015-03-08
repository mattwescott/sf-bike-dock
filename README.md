## Install Python packages
pip install -r requirements.txt

## Start the web api
python webapi.py runserver

## Angular App
To run the Angular app (stand-alone), first install dependencies using 'bower install'.

Then, serve the 'public' folder with a webserver. One easy way is with python's SimpleHTTPServer:
python -m SimpleHTTPServer 8000

