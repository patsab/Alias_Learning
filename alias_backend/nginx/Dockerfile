FROM nginx

#Prod config
COPY nginx.conf.template /etc/nginx/conf.d/default.conf

EXPOSE 8000
CMD ["nginx","-g","daemon off;"]

