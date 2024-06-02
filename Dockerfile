FROM node:18-alpine AS builder
WORKDIR "/app"
COPY . .
RUN corepack enable
RUN yarn install --immutable
RUN yarn build

# Set NODE_ENV environment variable
ENV NODE_ENV production

FROM node:18-alpine AS production
WORKDIR "/app"
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD [ "sh", "-c", "yarn run start:prod"]
