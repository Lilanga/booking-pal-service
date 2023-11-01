FROM oven/bun:1.0.2 as builder

WORKDIR /app

COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
COPY package.json .
COPY bun.lockb .
COPY prisma ./prisma

RUN bun install --production
RUN bunx prisma generate

COPY src src
COPY tsconfig.json .
COPY swaggerDoc.json .

RUN bun build ./src/index.ts --outdir ./dist --target bun

FROM oven/bun:1.0.7-slim

WORKDIR /app

COPY --from=builder /app/node_modules/.prisma node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma node_modules/@prisma
COPY --from=builder /app/dist dist

ENV NODE_ENV production
CMD ["bun", "dist/index.js"]

EXPOSE 3000