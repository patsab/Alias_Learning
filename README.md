# IT-Projekt ALIAS

An intelligent Interrogate-Service for students to help them learning (hopefully not boring) stuff.

# Run whole app

If you want to run the whole App, use:
'docker-compose up -d'

# Run each component individually

Docker uses the container names for communication. If u don't want to use docker and run everything local instead, u need to change the URLs

1. Angular:
/src/app/app.config.ts change http://pymongo:5000 to http://localhost:5000
-->install dependencies with 'npm install'
-->run with 'ng serve'

2.Backend:
/backend/backend.py:
-change predictUrl from "http://correctness:5001/compare" to http://localhost:5001/compare
-comment out line: serve(app,host="0.0.0.0",port=5000)
-add line app.run(port=5000)
--> install dependencies with 'pip install -r requirements'
--> run with 'python3 backend.py'

3.Correctness:
/correctness/correctness.py:
-comment out line: serve(app,host="0.0.0.0",port=5001)
-add line app.run(port=5001)
--> install dependencies with 'pip install -r requirements'
--> install language corpus with 'python3 -m spacy download de_trf_bertbasecased_lg' and
    'python3 -m spacy download de_core_news_md'             
--> run with 'python3 correctness.py'

Remember: to run the backend u need a MongoDB on the default Ports.Start a dockerized Version with:
'docker run --name mongodb -d -p 27017-27019:27019-27019 mongo:4.0.16'


# Authors:
Patrick Sabau
Patrick Schneider
Andreas Schüpferling 
