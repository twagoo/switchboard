FROM registry.gitlab.com/clarin-eric/docker-alpine-base:1.1.0

MAINTAINER andre@clarin.eu

ADD . /tmp/lrs

RUN apk update \
    && apk add --upgrade --no-cache nodejs \        
    && rm -rf /var/cache/apk/* \
    && npm i npm@latest -g \
    && npm i webpack -g \
    && (cd /tmp/lrs \
    && npm ci \
    && webpack \
    && cp -r build/* /srv/html/$CLRS_PATH \
    && mkdir -p /srv/uwsgi \
    && cp -r docker/app/main.py /srv/uwsgi/) \
    && rm -rf /tmp/lrs \ 
    && apk del nodejs

