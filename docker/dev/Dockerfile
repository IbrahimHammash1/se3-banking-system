FROM node:22-alpine

# Install pnpm globally
RUN npm i -g pnpm

WORKDIR /usr/app

# Copy package files first for efficient caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy remaining application files
COPY . .

# Copy Prisma configuration
COPY prisma ./prisma

# Copy environment file
COPY .env.example .env

# run prisma generate
RUN pnpm run prisma:generate:schema

# Build the NestJS application
RUN pnpm run build

# Generate schema at runtime
CMD ["pnpm", "run","container:dev"]