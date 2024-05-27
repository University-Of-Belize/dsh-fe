ARG BUN_VERSION=1.1.3
FROM oven/bun:${BUN_VERSION}-slim as builder

# NPM will not install any package listed in "devDependencies" when NODE_ENV is set to "production",
# to install all modules: "npm install --production=false".
# Ref: https://docs.npmjs.com/cli/v9/commands/npm-install#description

# ENV NODE_ENV production

# RUN apt-get update -qq && \
#    apt-get install --no-install-recommends -y build-essential curl node-gyp

# Bun app build lives in here
RUN mkdir /build
WORKDIR /build

COPY . .

RUN bun install
RUN bun run sitemap
RUN bun run build
# RUN rm -rf node_modules
# RUN bun install --ci  # Install with Continuous Integration


# Start anew
FROM oven/bun:${BUN_VERSION}-slim

COPY --from=builder /build/build /app
# COPY --from=builder /build/node_modules /app

# Not sure if we need these, but for now we'll just copy the package and bun lock
COPY --from=builder /build/package.json /app
COPY --from=builder /build/bun.lockb /app
# COPY --from=builder /build/package-lock.json /app
RUN bun install --ci # Run again for verification
RUN bun pm trust --all # Trust that the postinstalls won't kill us

# Begin
WORKDIR /app
ENV NODE_ENV production

# Hack up an init script
RUN echo \#\!/usr/bin/env bash >> start.sh
RUN echo "PORT=8080 bun index.js" >> start.sh
RUN chmod +x start.sh

CMD [ "./start.sh" ]