# first step
FROM node:latest as builder

COPY ["package*.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install --only=production

COPY [".", "/usr/src/"]

RUN npm install --only=development

CMD ["npm", "run", "build"]

# second step
FROM node:latest

COPY ["package*.json", "/usr/src/"]

WORKDIR /usr/src

RUN npm install --only=production

COPY --from=builder ["/usr/src/bundle", "/usr/src/"]

EXPOSE 3000

CMD ["npm", "run", "production"]