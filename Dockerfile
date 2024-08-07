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

# Do we have an '.env' file present?
RUN if [ -f .env ]; then \
    echo "Found .env file. Continuing..."; \
  else \
    echo "No .env file found. Quitting."; \
    exit 1; \
  fi

# Auth Sentry
RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y curl ca-certificates
RUN curl -sL https://sentry.io/get-cli/ | sh

# Login to Sentry
RUN if [ -f ./release ]; then \
    echo "Logged-in to Sentry"; \
    sentry-cli login --auth-token "$(cat sentry_token.txt)"; \
  else \
    echo "Release file does not exist-skipping additional steps."; \
  fi

RUN bun install
RUN bun --bun run sitemap
RUN bunx svelte-kit sync
RUN bunx --bun vite build
RUN cp -r ./static/~partytown ./build/client/~partytown
# RUN rm -rf node_modules
# RUN bun install --ci  # Install with Continuous Integration

# Sentry sourcemap uploading and delete sourcemaps from 'prod'
RUN if [ -f ./release ]; then \
    echo "Built for production. Uploading sourcemaps"; \
    sentry-cli releases new $(sentry-cli releases propose-version) --project ubcafe; \
    sentry-cli sourcemaps inject ./build; \
    sentry-cli sourcemaps upload ./build --project ubcafe; \
    find ./build -type f -name "*.map" -exec rm -rf {} \;; \
    sentry-cli releases finalize $(sentry-cli releases propose-version); \
  else \
    echo "Release file does not exist-skipping additional steps."; \
  fi

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
