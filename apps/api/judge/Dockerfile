FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 g++ openjdk-17-jdk-headless ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /judge

COPY package.json ./
RUN npm install --omit=dev

COPY runner.mjs ./
COPY harnesses ./harnesses

RUN useradd --create-home --uid 10001 judge \
  && mkdir -p /workspace \
  && chown -R judge:judge /judge /workspace

USER judge
WORKDIR /workspace

ENTRYPOINT ["node", "/judge/runner.mjs"]
