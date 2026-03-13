# Stage 1: Build frontend
FROM ubuntu:22.04 AS front-builder

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    ca-certificates curl gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /front
COPY front/package.json front/package-lock.json ./
RUN npm install
COPY front/ .
RUN npm run build

# Stage 2: Build backend and bundle everything
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    ca-certificates curl gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY back/package.json ./
RUN npm install --legacy-peer-deps
COPY back/ .
RUN npm run build && cp ServiceInformation.js dist/

# Copy frontend build into public/
COPY --from=front-builder /front/dist ./public

EXPOSE 3000

CMD ["node", "dist/server.js"]
