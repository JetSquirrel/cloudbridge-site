# cloudbridge.jetsquirrel.cloud

The website for [CloudBridge](https://github.com/JetSquirrel/cloudbridge): the
product page, the documentation, the blog and the browser demo, one site
served by a Cloudflare Worker as static assets.

| Address | Source |
| --- | --- |
| [cloudbridge.jetsquirrel.cloud](https://cloudbridge.jetsquirrel.cloud/) | `home/` — static HTML and CSS, English and `zh/` |
| [cloudbridge.jetsquirrel.cloud/docs](https://cloudbridge.jetsquirrel.cloud/docs/) | `docs/` — a VitePress site with base `/docs/`, English and `zh/` |
| [cloudbridge.jetsquirrel.cloud/blog](https://cloudbridge.jetsquirrel.cloud/blog/) | `blog/` — a second VitePress site with base `/blog/`, English posts and `zh/` |
| [cloudbridge.jetsquirrel.cloud/demo](https://cloudbridge.jetsquirrel.cloud/demo/) | built in the app repository, downloaded at build time (see below) |

The app itself, and the code these pages describe, live in
[JetSquirrel/cloudbridge](https://github.com/JetSquirrel/cloudbridge). A change
to the app that changes what the docs say needs a pull request here too.

## Work on it locally

The product page has no build step; serve the folder:

```bash
python3 -m http.server -d home 8000   # http://localhost:8000/
```

The docs and the blog need Node.js 22 or newer:

```bash
npm --prefix docs ci             # install the locked dependencies
npm --prefix docs run dev        # http://localhost:5173/docs/
npm --prefix blog ci
npm --prefix blog run dev        # http://localhost:5173/blog/
SKIP_DEMO=1 sh scripts/build.sh  # the whole site in dist/site; fails on a dead link
```

English pages live in `docs/`, Chinese pages in `docs/zh/`, with the same file
names and the same heading anchors. Every page carries a `description` in its
frontmatter — it is the text search results and link previews show.

A blog post is written for one language and not translated: English ones in
`blog/`, Chinese ones in `blog/zh/`. Its frontmatter needs a `title`,
`description`, `date` and `tag`; the blog's front page lists posts from
those, newest first, so a new post needs no list edited. Images go in
`blog/images/`. The blog reuses the docs' stylesheet, and links to a docs
page by its full address, since the two are separate builds.

The product page loads nothing from anyone else: no web fonts, no third-party
scripts, no analytics — its one script is the few inline lines that offer the
Windows build to Windows visitors. Keep it that way; CloudBridge's promise is
that your bills stay on your machine, and its own website should not phone
home either.

## The demo

`/demo/` is the CloudBridge app compiled to WebAssembly. Building it needs a
pinned Rust nightly, which this repository does not install. The app
repository's CI builds it on every push to `main` and publishes it as
`cloudbridge-web-demo.tar.gz` on a rolling `web-demo` release;
`scripts/build.sh` downloads that and unpacks it into `dist/site/demo`.

- `SKIP_DEMO=1` leaves the demo out, for working on the pages alone.
- `DEMO_ARCHIVE=path/to/archive.tar.gz` uses a demo you built yourself
  (`./scripts/build-web.sh --release` in the app repository, then
  `tar -czf … -C web/site .`).

## Deploy

Cloudflare builds and deploys the site straight from this repository
(Workers Builds): every push to `main` goes live, and every pull request gets
a preview build — which fails on a dead link in the docs. `scripts/build.sh`
puts the product page, the docs and the demo together in `dist/site`, and
`wrangler.jsonc` serves that directory.

| Setting | Value |
| --- | --- |
| Project name | `cloudbridge-site` (must match `name` in `wrangler.jsonc`) |
| Build command | *(empty — `wrangler.jsonc` runs `scripts/build.sh` itself)* |
| Deploy command | `npx wrangler deploy` |
| Preview command | `npx wrangler versions upload` |
| Root directory | the repository root |

The custom domain is `cloudbridge.jetsquirrel.cloud` (Settings → Domains &
Routes). It used to point at the app repository's GitHub Pages; the old
addresses (`/docs.html`, `/policies.html`, `/blog.html`, `/blog/*.html`) are
redirected to their new homes by `home/_redirects`, as are the blog's
addresses from when it lived inside the docs (`/docs/blog/*`,
`/docs/zh/blog/*`).

For search engines, submit all three sitemaps,
`https://cloudbridge.jetsquirrel.cloud/sitemap.xml`,
`https://cloudbridge.jetsquirrel.cloud/docs/sitemap.xml` and
`https://cloudbridge.jetsquirrel.cloud/blog/sitemap.xml`; `robots.txt` lists
them too.

For AI assistants and answer engines: `home/llms.txt` (served at `/llms.txt`)
summarises CloudBridge and links every docs page as Markdown. The docs build
writes each page again as `.md` beside its HTML (`/docs/cloudflare.md`) and
all of a language's pages into `/docs/llms-full.txt` and
`/docs/zh/llms-full.txt`; keep `llms.txt` in step when a page is added or
renamed. Docs pages carry BreadcrumbList and TechArticle (BlogPosting for
posts) JSON-LD, and the product page carries SoftwareApplication and FAQPage
JSON-LD — the FAQ's answers are the visible ones in the page, so change both
together.

## License

MIT, like CloudBridge. The logos in `home/logos/` are their owners'
trademarks; see `home/logos/README.md`.
