# 1) Phase "deps" : installer les dépendances
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Phase "builder" : générer le client Prisma + compiler TS
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
RUN npx prisma generate
RUN npm run build

# 3) Phase "runner" : image minimale pour exécuter l’API
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000
CMD ["node", "dist/index.js"]
