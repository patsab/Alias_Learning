# IT-Projekt ALIAS

An intelligent Interrogate-Service for students to help them learning (hopefully not boring) stuff.

## Run whole app 

First check the following things:\
* Ports in docker-compose.yml
* aliasFrontend/src/app/app.config.ts -> The Frontend_URL and API_Endpoint must point to the running apps 
* The Frontend_URL must be registers inside gitlab for auth: If you want to use it local, change Frontend_URL to "http://localhost:80" \

If you want to run the whole App, use: \
```
docker-compose up --build -d
```
The Frontend will be served on Port 80(change in docker-compose.yml if needed)

## Run each component individually

Docker uses the container names for communication. If u don't want to use docker and run everything local instead, u need to change some parts

* 1. Angular:
```
-->install dependencies with 'npm install'
-->change app.config.ts to point to the running applications
-->run with 'ng serve'
```

* 2.Backend:
```
/backend/backend.py:
-change predictUrl from "http://correctness:5010/compare" to http://localhost:5010/compare
-comment out line: serve(app,host="0.0.0.0",port=5000)
-add line app.run(port=5000)
--> install dependencies with 'pip install -r requirements'
--> run with 'python3 backend.py'
```

* 3.Correctness:
```
/correctness/correctness.py:
-comment out line: serve(app,host="0.0.0.0",port=5001)
-add line app.run(port=5001)
--> install dependencies with 'pip install -r requirements'
--> install language corpus with 'python3 -m spacy download de_trf_bertbasecased_lg' and
    'python3 -m spacy download de_core_news_md'             
--> run with 'python3 correctness.py'
```

Remember: to run the backend u need a MongoDB on the default Ports.Start a dockerized Version with:
```
docker run --name mongodb -d -p 27017-27019:27019-27019 mongo:4.0.16
```

## Run the app on a kickstarted Ubuntu VM
The following Steps were taken, for the Deployment on an VM:
```
sudo apt-get update

#Install Docker
sudo apt-get install docker.io
docker --version

#Install docker-compose
sudo apt-get install python3-pip
pip3 install docker-compose
docker-compose --version

#Start the docker deamon
sudo systemctl start docker.service
systemctl status docker.service

#normally you need sudo to run a docker command
#Change it, so u don't need it anymore
sudo usermod -aG docker $USER

#Restart the Terminal
#"docker ps" should work, and not only "sudo docker ps"

#clone git
git clone https://git.informatik.fh-nuernberg.de/sabaupa72181/alias.git

#Change directory to the newly created folder
cd alias

#Check if Ports etc. are correct

#In docker-compose.yml 
#create Mount 
sudo mkdir -p /data/mongodb
#the corresponding lines are commented in the .yml file

#Start with
docker-compose up --build -d

```

## Import JSON Files to DB
```
#Copy the Json Files in the mongodb container
docker cp contentgenerierung/FILENAME.json mongodb:/

#Open a terminal inside container
docker exec -it mongodb bash

#Import the files
mongoimport --db alias --collection cards --file ./FILENAME.json --jsonArray
```

### Authors:
* Patrick Sabau
* Patrick Schneider
* Andreas Schüpferling 
