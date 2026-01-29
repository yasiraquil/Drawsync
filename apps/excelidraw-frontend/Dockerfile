FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/excelidraw-frontend/ ./apps/excelidraw-frontend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend
RUN pnpm --filter excelidraw-frontend build

WORKDIR /app/apps/excelidraw-frontend

EXPOSE 3001

CMD ["pnpm", "start"]
