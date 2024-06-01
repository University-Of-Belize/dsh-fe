ARG BUN_VERSION=1.1.10
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

# Auth Sentry
RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y curl ca-certificates
RUN curl -sL https://sentry.io/get-cli/ | sh
RUN sentry-cli login --auth-token "$(cat sentry_token.txt)"

RUN bun install
RUN bun --bun run sitemap
RUN bunx --bun vite build
# RUN rm -rf node_modules
# RUN bun install --ci  # Install with Continuous Integration


# Start anew
FROM oven/bun:${BUN_VERSION}-slim

# Create the work directory
RUN mkdir /app

# Copy our build directory
COPY --from=builder /build/build /app

# Begin
WORKDIR /app

# Not sure if we need these, but for now we'll just copy the package and bun lock
COPY --from=builder /build/package.json .
# COPY --from=builder /build/bun.lockb .  # Have bun run the conversion for us
COPY --from=builder /build/package-lock.json .
RUN bun install --ci # Install with Continuous Integration
RUN bun pm trust --all # Trust that the postinstalls don't kill us

ENV NODE_ENV production

# Hack up an init script
RUN echo \#\!/usr/bin/env bash >> start.sh
RUN echo "PORT=8080 bun --bun index.js" >> start.sh
RUN chmod +x start.sh

CMD [ "./start.sh" ]
EXPOSE 8080
