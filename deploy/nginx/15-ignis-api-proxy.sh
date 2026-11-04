#!/bin/sh
# Runs at container start (nginx image /docker-entrypoint.d). Renders the
# same-origin API proxy included by default.conf:
#
#   IGNIS_API_UPSTREAM unset  -> empty include (local stack: the bundle calls the
#                                API origin directly, VITE_API_URL=http://...)
#   IGNIS_API_UPSTREAM set    -> /api/v1/, /health and /ready are proxied to the
#                                API over Railway's private network. Nothing
#                                else of the API (docs, admin ports) is exposed.
#
# The upstream is resolved per request through the container's resolver, so an
# API redeploy (new private IP) never leaves nginx pointing at a dead address.
set -eu

OUT=/tmp/ignis/api-proxy.conf
mkdir -p /tmp/ignis
: > "$OUT"

UPSTREAM="${IGNIS_API_UPSTREAM:-}"
if [ -z "$UPSTREAM" ]; then
    echo "ignis: IGNIS_API_UPSTREAM ausente; proxy da API desligado." >&2
    exit 0
fi

# http://<private host>:<port> only: no path, no credentials, no TLS to a private
# name, nothing nginx could interpret as configuration.
if ! echo "$UPSTREAM" | grep -Eq '^http://[a-z0-9]([a-z0-9.-]*[a-z0-9])?:[0-9]{2,5}$'; then
    echo "ignis: IGNIS_API_UPSTREAM inválido (esperado http://host:porta)." >&2
    exit 1
fi

NS=$(awk '$1 == "nameserver" { print $2; exit }' /etc/resolv.conf)
if [ -z "$NS" ]; then
    echo "ignis: nenhum nameserver em /etc/resolv.conf." >&2
    exit 1
fi
case "$NS" in
    *:*) RESOLVER="[$NS]" ;;
    *) RESOLVER="$NS" ;;
esac

cat > "$OUT" <<CONF
resolver $RESOLVER valid=10s ipv6=on;
resolver_timeout 5s;

location /api/v1/ {
    set \$ignis_api "$UPSTREAM";
    include /etc/nginx/ignis-proxy-params.conf;
}

location = /health {
    set \$ignis_api "$UPSTREAM";
    include /etc/nginx/ignis-proxy-params.conf;
}

location = /ready {
    set \$ignis_api "$UPSTREAM";
    include /etc/nginx/ignis-proxy-params.conf;
}
CONF
echo "ignis: proxy da API ativo (/api/v1/, /health, /ready)." >&2
