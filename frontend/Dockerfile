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

FROM nginx:1.17
COPY --from=build /home/node/dist /usr/share/nginx/html/
HEALTHCHECK CMD curl http://localhost/ || exit 1
