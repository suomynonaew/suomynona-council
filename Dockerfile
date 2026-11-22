# Google Cloud Run & AI Studio production container for Suomynona Council
FROM node:22-slim

WORKDIR /app

# Never download Electron desktop binaries inside cloud containers
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1
ENV NODE_ENV=production
ENV PORT=8080
ENV DISABLE_HMR=true

# Install runtime & Vite build dependencies only (omits desktop electron / electron-builder)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund

# Copy application source
COPY . .

# Build static frontend bundle (dist/)
RUN npm run build

EXPOSE 8080

CMD ["npx", "tsx", "server.ts"]
