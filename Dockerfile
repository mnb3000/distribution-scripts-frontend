FROM node:16.15.1-alpine AS build

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build

FROM node:16.15.1-alpine AS deploy-node

WORKDIR / app
RUN rm -rf ./*
COPY --from=build /app/package.json .
COPY --from=build /app/yarn.lock .
COPY --from=build /app/build .
RUN yarn --prod
CMD ["node", "index.js"]