FROM continuumio/miniconda
RUN apt-get install -y python-pip
RUN pip install flask flask-cors flask-script flask-bootstrap geopy pandas
ADD webapi.py /code/
WORKDIR /code
EXPOSE 5002
CMD python webapi.py runserver --port 5002 --host 0.0.0.0
