FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/http-backned/ ./apps/http-backned/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build backend
RUN pnpm --filter http-backend build

WORKDIR /app/apps/http-backned

EXPOSE 3002

CMD ["node", "dist/index.js"]
