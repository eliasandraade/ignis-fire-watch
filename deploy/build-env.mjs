// Validates the build-time API configuration and prints the API origin used in
// the Content-Security-Policy connect-src. Fails the image build instead of
// shipping a bundle that silently points to the wrong place.
//
// Railway passes service variables as Docker build args: VITE_API_URL
// (https://${{api.RAILWAY_PUBLIC_DOMAIN}}). There is no demonstration build:
// the interface always talks to the API, so the URL is mandatory. A
// VITE_USE_API value still passed by older configurations is ignored.
const raw = (process.env.VITE_API_URL ?? "").trim();

function fail(message) {
  console.error(`build-env: ${message}`);
  process.exit(1);
}

if (!raw) fail("VITE_API_URL é obrigatório: o IGNIS não tem modo demonstrativo.");

let url;
try {
  url = new URL(raw);
} catch {
  // An unresolved ${{api.RAILWAY_PUBLIC_DOMAIN}} renders as "https://".
  fail(`VITE_API_URL inválido ou vazio: "${raw}". A API precisa de um domínio público.`);
}

const local = ["localhost", "127.0.0.1"].includes(url.hostname);
if (url.protocol !== "https:" && !(local && url.protocol === "http:")) {
  fail(`VITE_API_URL deve usar https (recebido ${url.protocol}).`);
}
if (url.pathname !== "/" || url.search || url.hash || url.username || url.password) {
  // The client appends /api/v1/...; only the origin belongs here.
  fail(`VITE_API_URL deve ser só a origem da API (ex.: https://api.exemplo.org), recebido "${raw}".`);
}

process.stdout.write(url.origin);
