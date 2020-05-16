#####
#build the app
#####
FROM node:12.16.3-buster as build

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

WORKDIR /app

#install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@9.1.4


#generate build 
COPY . /app
RUN ng build --output-path=dist

#####
#serve the app
#####
FROM nginx

#copy build from the 'build env'
COPY nginx.conf.template /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
