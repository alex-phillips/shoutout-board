FROM node

COPY . /app

RUN \
 cd /app && \
 npm install --no-dev && \
 cd pwa && \
 npm install --no-dev && \
 npm run build-prod && \
 cd ..

WORKDIR /app

CMD [ "/usr/local/bin/npm", "start" ]
