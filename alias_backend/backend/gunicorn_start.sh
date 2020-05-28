#!/bin/sh
gunicorn backend:app -b 0.0.0.0:8000 --certfile=/etc/letsencrypt/live/alias-learning.de/fullchain.pem --keyfile=/etc/letsencrypt/live/alias-learning.de/privkey.pem