FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/ws-backend/ ./apps/ws-backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd packages/db && npx prisma generate

# Build backend
RUN pnpm --filter ws-backend build

WORKDIR /app/apps/ws-backend

EXPOSE 8081

CMD ["node", "dist/index.js"]
