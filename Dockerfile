# IGNIS web (React/Vite) for Railway: static build served by unprivileged nginx.
# Base images pinned by digest, like the GitHub Actions in CI.

FROM node:22.19.0-bookworm-slim@sha256:4a4884e8a44826194dff92ba316264f392056cbe243dcc9fd3551e71cea02b90 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Railway passes service variables as build args; Vite inlines them in the bundle.
ARG VITE_API_URL=
RUN node deploy/build-env.mjs > /tmp/api-origin \
    && npm run build \
    && sed "s|@IGNIS_API_ORIGIN@|$(cat /tmp/api-origin)|" deploy/nginx/default.conf.template \
       > /tmp/default.conf.template

FROM nginxinc/nginx-unprivileged:1.28-alpine@sha256:7377697a821c131a924a7105fafbe7414db4e9fcc77a6f08f776f33f141ec3f8
# Railway overrides PORT; 8080 is the local default (the image runs as uid 101).
ENV PORT=8080
COPY --from=build /tmp/default.conf.template /etc/nginx/templates/default.conf.template
# Owned by root: the runtime user can read the site but not modify it.
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
