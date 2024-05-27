ARG BUN_VERSION=1.1.3
FROM oven/bun:${BUN_VERSION}-slim as builder

# NPM will not install any package listed in "devDependencies" when NODE_ENV is set to "production",
# to install all modules: "npm install --production=false".
# Ref: https://docs.npmjs.com/cli/v9/commands/npm-install#description

# ENV NODE_ENV production

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential curl node-gyp

# Bun app build lives in here
RUN mkdir /app

# Begin
WORKDIR /app

COPY . .

RUN bun install
RUN bun run sitemap
RUN bun run build
RUN rm -rf .svelte-kit

# Start anew
FROM oven/bun:${BUN_VERSION}-slim

COPY --from=builder /app/build /app

# Begin
WORKDIR /app

ENV NODE_ENV production

CMD [ "PORT=8080", "bun", "index.js" ]