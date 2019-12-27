FROM node:12

USER node
WORKDIR /home/node
COPY package* src/index.js /home/node/
RUN npm ci --only-production && npm cache clean --force
ENTRYPOINT [ "node", "index.js" ]
HEALTHCHECK CMD curl -s http://localhost:3001/_healthz || exit 1