FROM node:18-alpine

WORKDIR /app


RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package.json ./

RUN yarn install --network-timeout 100000

COPY . .

RUN yarn prisma generate

RUN yarn build

CMD ["npm", "run", "start:migrate:prod"]
