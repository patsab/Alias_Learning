FROM python:3.7.7-buster


#First copy the requirments.txt and load them
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip3 install -r requirements.txt


#get the rest of the code
COPY ./auth.py /app/auth.py
COPY ./backend.py /app/backend.py 
COPY ./backend_config_dev.cfg /app/backend_config_dev.cfg


#Start the app as flask dev server
ENTRYPOINT ["python"]
CMD ["/app/backend.py"]
