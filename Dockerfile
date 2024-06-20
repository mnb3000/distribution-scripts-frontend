FROM node:18.16.1-alpine AS build

WORKDIR /app
COPY . .

RUN yarn && yarn build

FROM node:18.16.1-alpine AS deploy-node

WORKDIR / app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/yarn.lock .
COPY --from=build /app/build .
RUN yarn --prod
CMD ["node", "index.js"]
