FROM lsiobase/alpine:3.9

COPY . /app

RUN \
 apk update && \
 apk add nodejs npm python make musl-dev g++ && \
 cd /app && \
 npm install --no-dev && \
 cd pwa && \
 npm install --no-dev && \
 npm run build-prod && \
 cd ..

WORKDIR /app

CMD [ "/usr/local/bin/npm", "start" ]
