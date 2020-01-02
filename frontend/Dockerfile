FROM node:12 as build

ARG VUE_APP_API_KEY
ARG VUE_APP_API_SERVER

USER node
WORKDIR /home/node
COPY package* postcss.config.js /home/node/
RUN npm ci
COPY src /home/node/src
COPY public /home/node/public
RUN npm run build

FROM httpd:2-alpine as htpass
ARG HT_USER=admin
ARG HT_PASS=secret
RUN htpasswd -cb /htpasswd ${HT_USER} ${HT_PASS}

FROM nginx:1.17
COPY --from=build /home/node/dist /usr/share/nginx/html/
COPY --from=htpass /htpasswd /etc/nginx/.htpasswd
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK CMD curl http://localhost/ || exit 1
