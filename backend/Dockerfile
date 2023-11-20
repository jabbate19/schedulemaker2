FROM oven/bun:latest

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY src ./

CMD ["bun", "main.ts"]

