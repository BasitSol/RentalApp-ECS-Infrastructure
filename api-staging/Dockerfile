FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl && \
    addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

WORKDIR /app

# Install dependencies first (layer caching)
COPY --chown=nodeuser:nodegroup package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy only required runtime files
COPY --chown=nodeuser:nodegroup bin ./bin
COPY --chown=nodeuser:nodegroup consts ./consts
COPY --chown=nodeuser:nodegroup controllers ./controllers
COPY --chown=nodeuser:nodegroup models ./models
COPY --chown=nodeuser:nodegroup routes ./routes
COPY --chown=nodeuser:nodegroup app.js ./
COPY --chown=nodeuser:nodegroup passport-config.js ./

# Syntax-only validation so the image build does not depend on runtime secrets
RUN node --check ./app.js

USER nodeuser

ENV NODE_ENV=production
ENV PORT=4000
ENV NODE_OPTIONS="--max-old-space-size=512"

EXPOSE 4000

# Healthcheck matches the production readiness endpoint exposed by the app
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:4000/healthz || exit 1

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "./bin/www"]