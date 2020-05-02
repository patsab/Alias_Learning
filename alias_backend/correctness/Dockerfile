FROM python:3.7.7-buster


#First copy the requirments.txt and load them
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip3 install -r requirements.txt

#install the language corpus
RUN python3 -m spacy download de_trf_bertbasecased_lg
RUN python3 -m spacy download de_core_news_md

#get the rest of the code
COPY ./correctness.py /app/correctness.py
COPY ./correctness_config_dev.cfg /app/correctness_config_dev.cfg

#start the app
ENTRYPOINT ["python"]
CMD ["/app/correctness.py"]
