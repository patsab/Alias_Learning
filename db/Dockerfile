FROM mongo:4.0.16

ENV MONGO_INITDB_ROOT_USERNAME createdb
ENV MONGO_INITDB_ROOT_PASSWORD ezebcWde
ENV MONGO_INITDB_DATABASE admin

ADD ./create-user.sh /docker-entrypoint-initdb.d/
