FROM continuumio/miniconda
RUN pip install flask flask-cors flask-script flask-bootstrap geopy
ADD . /code
WORKDIR /code
EXPOSE 5002
CMD python webapi.py runserver --port 5002
