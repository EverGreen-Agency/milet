FROM node:22-alpine AS dependencies
WORKDIR /workspace
COPY package.json package-lock.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/domain/package.json packages/domain/package.json
COPY packages/test-fixtures/package.json packages/test-fixtures/package.json
RUN npm ci

FROM dependencies AS build
COPY tsconfig.json tsconfig.base.json ./
COPY apps/api apps/api
COPY apps/worker apps/worker
COPY packages packages
RUN npm run build:foundation && npm prune --omit=dev

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=4310 BIND_ADDRESS=0.0.0.0 DEMO_DATA_ONLY=true
WORKDIR /app
COPY --from=build --chown=node:node /workspace/package.json /workspace/package-lock.json ./
COPY --from=build --chown=node:node /workspace/node_modules ./node_modules
COPY --from=build --chown=node:node /workspace/apps/api/package.json ./apps/api/package.json
COPY --from=build --chown=node:node /workspace/apps/api/dist ./apps/api/dist
COPY --from=build --chown=node:node /workspace/packages ./packages
USER node
EXPOSE 4310
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/health/live').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "apps/api/dist/main.js"]
