# SF Bike Dock

Find nearby bicyle parking places in San Francisco.


## Python / ML Component

### Install Python packages
pip install -r requirements.txt

### Start the web api
python webapi.py runserver

## Web Server Component

### MEAN App
To run the app (stand-alone), first install dependencies using:
npm install

Then, run using:
grunt



## Docker Info

The app currently uses mulitple containers. One for the Python app and one for the Web app.


### Build the Images
```
docker build -t mattwescott/bike-dock-ml -f Dockerfile.ml .
docker build -t mattwescott/bike-dock-web -f Dockerfile.web .
```

### Run the Images in Local Containers
```
docker run -d -p 5002:5002 --name sf-bike-dock-ml mattwescott/bike-dock-ml
docker run -d -p 80:3000 --name sf-bike-dock-web mattwescott/bike-dock-web
```


