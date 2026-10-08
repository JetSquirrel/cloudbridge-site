#!/bin/sh
# Build the whole of cloudbridge.jetsquirrel.cloud into dist/site: the product
# page from home/ at the root, the VitePress docs under /docs/, and the
# browser demo under /demo/. One Worker serves the result (wrangler.jsonc);
# Cloudflare runs this as the build command.
#
# The demo is the CloudBridge app compiled to WebAssembly, which needs a
# pinned Rust nightly this build has no business installing. The app
# repository's CI builds it on every push to main and publishes it as the
# asset of a rolling `web-demo` release; this downloads that. DEMO_ARCHIVE
# points at a local archive instead (a build of your own), and SKIP_DEMO=1
# leaves the demo out, for working on the pages alone.
set -eu
cd "$(dirname "$0")/.."

DEMO_URL="${DEMO_URL:-https://github.com/JetSquirrel/cloudbridge/releases/download/web-demo/cloudbridge-web-demo.tar.gz}"

rm -rf dist/site
npm --prefix docs ci
npm --prefix docs run build          # writes dist/site/docs (see outDir)
cp -R home/. dist/site/

if [ "${SKIP_DEMO:-}" = "1" ]; then
  echo "Skipping the demo (SKIP_DEMO=1)"
else
  rm -rf .demo && mkdir -p .demo
  if [ -n "${DEMO_ARCHIVE:-}" ]; then
    cp "$DEMO_ARCHIVE" .demo/demo.tar.gz
  else
    curl -fsSL --retry 3 -o .demo/demo.tar.gz "$DEMO_URL"
  fi
  mkdir -p dist/site/demo
  tar -xzf .demo/demo.tar.gz -C dist/site/demo
  # The demo is a page and its module; without its page it is no demo.
  test -f dist/site/demo/index.html
fi

echo "Built dist/site: $(find dist/site -type f | wc -l | tr -d ' ') files"
