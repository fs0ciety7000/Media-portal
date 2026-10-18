FROM node:24-alpine

ENV NODE_ENV=production PORT=3000
WORKDIR /app

COPY server.mjs ./server.mjs
COPY index.html login.html styles.css app.js login.js ./
COPY assets ./assets

EXPOSE 3000
USER node
CMD ["node", "server.mjs"]
