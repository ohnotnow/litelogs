FROM node:12-slim

USER node
WORKDIR /home/node
COPY package* /home/node/
COPY src/ /home/node/src/
RUN npm ci --only-production && npm cache clean --force
ENTRYPOINT [ "node", "src/index.js" ]
HEALTHCHECK CMD curl -s http://localhost:3001/_healthz || exit 1
