import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createContentLoader, defineConfig, type HeadConfig } from 'vitepress'

// The blog, at /blog/ beside the product page and the docs rather than inside
// the docs: posts read without the docs' sidebar and outline, and the list is
// a page of its own. Each language has its own posts under its folder — zh/,
// ja/, ko/, fr/ — and a post is written for one language and has no twin in
// the others.
const repository = 'https://github.com/JetSquirrel/cloudbridge'
const siteRepository = 'https://github.com/JetSquirrel/cloudbridge-site'
const home = 'https://cloudbridge.jetsquirrel.cloud/'
const site = `${home}blog/`
const docs = `${home}docs/`
const ogImage = `${docs}og-image.png`
// Who writes the posts and who publishes them, for the structured data and
// the feeds.
const author = { '@type': 'Person', name: 'JetSquirrel', url: 'https://github.com/JetSquirrel' }
const publisher = {
  '@type': 'Organization',
  name: 'CloudBridge',
  url: home,
  logo: { '@type': 'ImageObject', url: `${home}assets/logo-160.png`, width: 160, height: 160 },
}

// The languages posts are written in. `prefix` is the folder under /blog/ and
// `lang` what `lang`, `hreflang` and the feeds take.
const languages = {
  en: { prefix: '', lang: 'en', ogLocale: 'en_US', label: 'English' },
  zh: { prefix: 'zh/', lang: 'zh-CN', ogLocale: 'zh_CN', label: '简体中文' },
  ja: { prefix: 'ja/', lang: 'ja', ogLocale: 'ja_JP', label: '日本語' },
  ko: { prefix: 'ko/', lang: 'ko', ogLocale: 'ko_KR', label: '한국어' },
  fr: { prefix: 'fr/', lang: 'fr', ogLocale: 'fr_FR', label: 'Français' },
  es: { prefix: 'es/', lang: 'es', ogLocale: 'es_ES', label: 'Español' },
  de: { prefix: 'de/', lang: 'de', ogLocale: 'de_DE', label: 'Deutsch' },
  pt: { prefix: 'pt/', lang: 'pt-BR', ogLocale: 'pt_BR', label: 'Português (Brasil)' },
} as const
type Lang = keyof typeof languages

// One Atom feed per language, since a post is written for one of them.
const feeds = {
  en: { url: `${site}feed.xml`, file: 'feed.xml', title: 'CloudBridge Blog', blog: site, lang: 'en' },
  zh: { url: `${site}zh/feed.xml`, file: 'zh/feed.xml', title: 'CloudBridge 博客', blog: `${site}zh/`, lang: 'zh-CN' },
  ja: { url: `${site}ja/feed.xml`, file: 'ja/feed.xml', title: 'CloudBridge ブログ', blog: `${site}ja/`, lang: 'ja' },
  ko: { url: `${site}ko/feed.xml`, file: 'ko/feed.xml', title: 'CloudBridge 블로그', blog: `${site}ko/`, lang: 'ko' },
  fr: { url: `${site}fr/feed.xml`, file: 'fr/feed.xml', title: 'CloudBridge Blog', blog: `${site}fr/`, lang: 'fr' },
  es: { url: `${site}es/feed.xml`, file: 'es/feed.xml', title: 'Blog de CloudBridge', blog: `${site}es/`, lang: 'es' },
  de: { url: `${site}de/feed.xml`, file: 'de/feed.xml', title: 'CloudBridge-Blog', blog: `${site}de/`, lang: 'de' },
  pt: { url: `${site}pt/feed.xml`, file: 'pt/feed.xml', title: 'Blog do CloudBridge', blog: `${site}pt/`, lang: 'pt-BR' },
}

// The blog's own wording, for the languages that are not English.
const blogText: Record<Lang, { home: string; docs: string; blog: string; nav: [string, string, string, string, string]; editLink: string; prev: string; next: string; langMenu: string; returnToTop: string; skipToContent: string; appearance: string; light: string; dark: string; notFound: { title: string; quote: string; linkLabel: string; linkText: string }; footer: string }> = {
  en: {
    home: 'Home',
    docs: 'Docs',
    blog: 'Blog',
    nav: ['Home', 'Docs', 'Blog', 'Demo', 'Download'],
    editLink: 'Edit this page on GitHub',
    prev: 'Previous post',
    next: 'Next post',
    langMenu: 'Change language',
    returnToTop: 'Return to top',
    skipToContent: 'Skip to content',
    appearance: 'Appearance',
    light: 'Switch to light theme',
    dark: 'Switch to dark theme',
    notFound: {
      title: 'Page not found',
      quote: 'This post does not exist. Have a look at the blog home for the other posts.',
      linkLabel: 'Go to the blog home',
      linkText: 'Go to the blog home',
    },
    footer: 'Released under the MIT License.',
  },
  zh: {
    home: '官网',
    docs: '文档',
    blog: '博客',
    nav: ['官网', '文档', '博客', '在线演示', '下载'],
    editLink: '在 GitHub 上编辑此页',
    prev: '上一篇',
    next: '下一篇',
    langMenu: '切换语言',
    returnToTop: '返回顶部',
    skipToContent: '跳转到内容',
    appearance: '外观',
    light: '切换到浅色主题',
    dark: '切换到深色主题',
    notFound: {
      title: '页面未找到',
      quote: '这篇文章不存在，回博客首页看看其他文章吧。',
      linkLabel: '返回博客首页',
      linkText: '返回博客首页',
    },
    footer: '基于 MIT 许可开源发布。',
  },
  ja: {
    home: 'ホーム',
    docs: 'ドキュメント',
    blog: 'ブログ',
    nav: ['ホーム', 'ドキュメント', 'ブログ', 'デモ', 'ダウンロード'],
    editLink: 'GitHub でこのページを編集',
    prev: '前の記事',
    next: '次の記事',
    langMenu: '言語を切り替える',
    returnToTop: 'トップへ戻る',
    skipToContent: 'コンテンツへスキップ',
    appearance: '外観',
    light: 'ライトテーマに切り替える',
    dark: 'ダークテーマに切り替える',
    notFound: {
      title: 'ページが見つかりません',
      quote: 'この記事は存在しません。ブログのホームで他の記事をご覧ください。',
      linkLabel: 'ブログのホームへ',
      linkText: 'ブログのホームへ',
    },
    footer: 'MIT ライセンスで公開しています。',
  },
  ko: {
    home: '홈',
    docs: '문서',
    blog: '블로그',
    nav: ['홈', '문서', '블로그', '데모', '다운로드'],
    editLink: 'GitHub에서 이 페이지 편집',
    prev: '이전 글',
    next: '다음 글',
    langMenu: '언어 전환',
    returnToTop: '맨 위로',
    skipToContent: '콘텐츠로 건너뛰기',
    appearance: '테마',
    light: '라이트 테마로 전환',
    dark: '다크 테마로 전환',
    notFound: {
      title: '페이지를 찾을 수 없습니다',
      quote: '이 글은 존재하지 않습니다. 블로그 홈에서 다른 글을 살펴보세요.',
      linkLabel: '블로그 홈으로',
      linkText: '블로그 홈으로',
    },
    footer: 'MIT 라이선스로 공개되었습니다.',
  },
  fr: {
    home: 'Accueil',
    docs: 'Documentation',
    blog: 'Blog',
    nav: ['Accueil', 'Documentation', 'Blog', 'Démo', 'Télécharger'],
    editLink: 'Modifier cette page sur GitHub',
    prev: 'Article précédent',
    next: 'Article suivant',
    langMenu: 'Changer de langue',
    returnToTop: 'Retour en haut',
    skipToContent: 'Aller au contenu',
    appearance: 'Apparence',
    light: 'Passer au thème clair',
    dark: 'Passer au thème sombre',
    notFound: {
      title: 'Page introuvable',
      quote: "Cet article n'existe pas. Retrouvez les autres articles sur la page d'accueil du blog.",
      linkLabel: "Aller à l'accueil du blog",
      linkText: "Aller à l'accueil du blog",
    },
    footer: 'Publié sous licence MIT.',
  },
  es: {
    home: 'Inicio',
    docs: 'Documentación',
    blog: 'Blog',
    nav: ['Inicio', 'Documentación', 'Blog', 'Demo', 'Descargar'],
    editLink: 'Editar esta página en GitHub',
    prev: 'Artículo anterior',
    next: 'Artículo siguiente',
    langMenu: 'Cambiar de idioma',
    returnToTop: 'Volver arriba',
    skipToContent: 'Ir al contenido',
    appearance: 'Apariencia',
    light: 'Cambiar al tema claro',
    dark: 'Cambiar al tema oscuro',
    notFound: {
      title: 'Página no encontrada',
      quote: 'Este artículo no existe. Mira los demás artículos en el inicio del blog.',
      linkLabel: 'Ir al inicio del blog',
      linkText: 'Ir al inicio del blog',
    },
    footer: 'Publicado bajo la licencia MIT.',
  },
  de: {
    home: 'Start',
    docs: 'Dokumentation',
    blog: 'Blog',
    nav: ['Start', 'Dokumentation', 'Blog', 'Demo', 'Herunterladen'],
    editLink: 'Diese Seite auf GitHub bearbeiten',
    prev: 'Vorheriger Beitrag',
    next: 'Nächster Beitrag',
    langMenu: 'Sprache wechseln',
    returnToTop: 'Nach oben',
    skipToContent: 'Zum Inhalt springen',
    appearance: 'Darstellung',
    light: 'Zum hellen Design wechseln',
    dark: 'Zum dunklen Design wechseln',
    notFound: {
      title: 'Seite nicht gefunden',
      quote: 'Dieser Beitrag existiert nicht. Schau dir die anderen Beiträge auf der Blog-Startseite an.',
      linkLabel: 'Zur Blog-Startseite',
      linkText: 'Zur Blog-Startseite',
    },
    footer: 'Veröffentlicht unter der MIT-Lizenz.',
  },
  pt: {
    home: 'Início',
    docs: 'Documentação',
    blog: 'Blog',
    nav: ['Início', 'Documentação', 'Blog', 'Demonstração', 'Baixar'],
    editLink: 'Editar esta página no GitHub',
    prev: 'Artigo anterior',
    next: 'Próximo artigo',
    langMenu: 'Mudar de idioma',
    returnToTop: 'Voltar ao topo',
    skipToContent: 'Ir para o conteúdo',
    appearance: 'Aparência',
    light: 'Mudar para o tema claro',
    dark: 'Mudar para o tema escuro',
    notFound: {
      title: 'Página não encontrada',
      quote: 'Este artigo não existe. Veja os outros artigos na página inicial do blog.',
      linkLabel: 'Ir para o início do blog',
      linkText: 'Ir para o início do blog',
    },
    footer: 'Publicado sob a licença MIT.',
  },
}

const blogSiteTitles: Record<Lang, string> = {
  en: 'CloudBridge Blog',
  zh: 'CloudBridge 博客',
  ja: 'CloudBridge ブログ',
  ko: 'CloudBridge 블로그',
  fr: 'CloudBridge Blog',
  es: 'Blog de CloudBridge',
  de: 'CloudBridge-Blog',
  pt: 'Blog do CloudBridge',
}
const blogDescriptions: Record<Lang, string> = {
  en: 'Release notes, design decisions and field notes from CloudBridge, the local-first desktop app for cloud and AI bills.',
  zh: 'CloudBridge 的中文文章：怎么用好它，以及它为什么这样设计。',
  ja: 'クラウドと AI の請求書を扱うローカル優先のデスクトップアプリ、CloudBridge のリリースノートと設計の話。',
  ko: '클라우드와 AI 청구서를 다루는 로컬 우선 데스크톱 앱, CloudBridge의 릴리스 노트와 설계 이야기.',
  fr: "Notes de version, décisions de conception et retours de terrain de CloudBridge, l'application de bureau locale-first pour les factures cloud et IA.",
  es: 'Notas de versión, decisiones de diseño y apuntes de CloudBridge, la aplicación de escritorio local-first para facturas de nube e IA.',
  de: 'Versionshinweise, Designentscheidungen und Feldnotizen von CloudBridge, der Local-First-Desktop-App für Cloud- und KI-Rechnungen.',
  pt: 'Notas de versão, decisões de design e apontamentos do CloudBridge, o aplicativo de desktop local-first para faturas de nuvem e IA.',
}

// The posts that are translated into English, Japanese, Korean and French.
// The Chinese blog has a post of its own, which has no twin.
const translatedPosts = new Set([
  'cloudbridge-0-2-0',
  'cloudbridge-0-3-0',
  'cloudbridge-0-3-1',
  'cloudbridge-0-4-0',
  'cloudbridge-0-5-0',
  'cloudbridge-vs-optscale',
  'cloudflare-durable-object-runaway',
])

function pageUrl(relativePath: string): string {
  return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
}

function pageLang(relativePath: string): Lang {
  const first = relativePath.split('/')[0]
  return (first in languages && first !== 'en' ? first : 'en') as Lang
}

function xml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function localeConfig(lang: Lang) {
  const t = blogText[lang]
  const language = languages[lang]
  const prefix = `/${language.prefix}`
  return {
    label: language.label,
    lang: language.lang,
    ...(lang === 'en' ? {} : { title: blogSiteTitles[lang], description: blogDescriptions[lang] }),
    themeConfig: {
      nav: [
        { text: t.nav[0], link: `${home}${language.prefix}` },
        { text: t.nav[1], link: `${docs}${language.prefix}` },
        { text: t.nav[2], link: prefix },
        { text: t.nav[3], link: `${home}demo/` },
        { text: t.nav[4], link: `${repository}/releases/latest` },
      ],
      editLink: { pattern: `${siteRepository}/edit/main/blog/:path`, text: t.editLink },
      docFooter: { prev: t.prev, next: t.next },
      langMenuLabel: t.langMenu,
      returnToTopLabel: t.returnToTop,
      skipToContentLabel: t.skipToContent,
      darkModeSwitchLabel: t.appearance,
      lightModeSwitchTitle: t.light,
      darkModeSwitchTitle: t.dark,
      notFound: t.notFound,
      footer: { message: t.footer },
    },
  }
}

export default defineConfig({
  title: 'CloudBridge Blog',
  description: 'Release notes, decisions and field notes from CloudBridge, the local-first desktop app for cloud and AI bills.',
  base: '/blog/',
  // Beside the docs in the one site scripts/build.sh assembles.
  outDir: '../dist/site/blog',
  cleanUrls: true,
  ignoreDeadLinks: false,
  // Per-post "last updated" dates for dateModified and the sitemap's lastmod.
  lastUpdated: true,
  sitemap: { hostname: site },
  head: [
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#0e1420' }],
    ['meta', { property: 'og:site_name', content: 'CloudBridge' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '675' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
  ],
  // A post is read, not navigated: no outline beside it.
  transformPageData(pageData) {
    pageData.frontmatter.aside ??= false
  },
  transformHead({ pageData, title, description }) {
    const path = pageUrl(pageData.relativePath)
    const lang = pageLang(pageData.relativePath)
    const language = languages[lang]
    const url = `${site}${path}`
    const post = Boolean(pageData.frontmatter.date)
    const feed = feeds[lang]
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: post ? 'article' : 'website' }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:locale', content: language.ogLocale }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['link', { rel: 'alternate', type: 'application/atom+xml', title: feed.title, href: feed.url }],
    ]
    // Structured data: where the page sits, and for a post, who wrote it and
    // when.
    const blogHome = feed.blog
    const crumbs = [
      { name: 'CloudBridge', item: `${home}${language.prefix}` },
      { name: blogText[lang].blog, item: blogHome },
    ]
    if (url !== blogHome) crumbs.push({ name: pageData.title || title, item: url })
    const graph: object[] = [{
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
    }]
    if (post) {
      const published = new Date(pageData.frontmatter.date).toISOString()
      head.push(['meta', { property: 'article:published_time', content: published }])
      if (pageData.frontmatter.tag) head.push(['meta', { property: 'article:tag', content: pageData.frontmatter.tag }])
      graph.push({
        '@type': 'BlogPosting',
        headline: pageData.title || title,
        description,
        url,
        mainEntityOfPage: url,
        inLanguage: language.lang,
        datePublished: published,
        ...(pageData.lastUpdated ? { dateModified: new Date(pageData.lastUpdated).toISOString() } : {}),
        image: ogImage,
        author,
        publisher,
        ...(pageData.frontmatter.tag ? { keywords: pageData.frontmatter.tag } : {}),
        isPartOf: { '@type': 'Blog', name: feed.title, url: blogHome },
        about: { '@type': 'SoftwareApplication', name: 'CloudBridge', url: home },
      })
    } else if (url === blogHome) {
      graph.push({
        '@type': 'Blog',
        name: feed.title,
        description,
        url,
        inLanguage: language.lang,
        publisher,
      })
    }
    // The front pages, and the posts that exist in every language, point at
    // their twins so a reader who lands on the wrong one can move across; a
    // post written for one language only carries no alternates.
    const rest = path.startsWith(language.prefix) ? path.slice(language.prefix.length) : path
    const twins: Lang[] = post
      ? translatedPosts.has(rest) ? (['en', 'ja', 'ko', 'fr', 'es', 'de', 'pt'] as Lang[]) : []
      : (Object.keys(languages) as Lang[])
    for (const key of twins) {
      head.push(['link', { rel: 'alternate', hreflang: languages[key].lang, href: `${site}${languages[key].prefix}${rest}` }])
    }
    if (twins.length) head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: `${site}${rest}` }])
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
    return head
  },
  locales: {
    root: localeConfig('en'),
    zh: localeConfig('zh'),
    ja: localeConfig('ja'),
    ko: localeConfig('ko'),
    fr: localeConfig('fr'),
    es: localeConfig('es'),
    de: localeConfig('de'),
    pt: localeConfig('pt'),
  },
  themeConfig: {
    logo: { src: '/logo.png', alt: 'CloudBridge' },
    // Posts are not translated, so switching language goes to the other
    // blog's front page rather than to a post that does not exist.
    i18nRouting: false,
    editLink: { pattern: `${siteRepository}/edit/main/blog/:path` },
    socialLinks: [{ icon: 'github', link: repository }],
    footer: { message: 'Released under the MIT License.' },
  },
  // An Atom feed for each language's posts, newest first: /blog/feed.xml,
  // /blog/zh/feed.xml, /blog/ja/feed.xml, /blog/ko/feed.xml and
  // /blog/fr/feed.xml.
  async buildEnd(config) {
    const pages = await createContentLoader(['*.md', 'zh/*.md', 'ja/*.md', 'ko/*.md', 'fr/*.md', 'es/*.md', 'de/*.md', 'pt/*.md']).load()
    for (const [key, feed] of Object.entries(feeds)) {
      const posts = pages
        .filter((page) => page.frontmatter.date && pageLang(page.url.replace(/^\//, '')) === key)
        .map((page) => ({
          url: `${site}${page.url.replace(/^\//, '')}`,
          title: String(page.frontmatter.title),
          description: String(page.frontmatter.description ?? ''),
          date: new Date(page.frontmatter.date).toISOString(),
          tag: page.frontmatter.tag ? String(page.frontmatter.tag) : '',
        }))
        .sort((a, b) => b.date.localeCompare(a.date))
      const entries = posts.map((post) => [
        '  <entry>',
        `    <title>${xml(post.title)}</title>`,
        `    <link href="${post.url}"/>`,
        `    <id>${post.url}</id>`,
        `    <published>${post.date}</published>`,
        `    <updated>${post.date}</updated>`,
        `    <summary>${xml(post.description)}</summary>`,
        ...(post.tag ? [`    <category term="${xml(post.tag)}"/>`] : []),
        '  </entry>',
      ].join('\n'))
      const body = [
        '<?xml version="1.0" encoding="utf-8"?>',
        `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${feed.lang}">`,
        `  <title>${xml(feed.title)}</title>`,
        `  <id>${feed.blog}</id>`,
        `  <link rel="self" href="${feed.url}"/>`,
        `  <link rel="alternate" type="text/html" href="${feed.blog}"/>`,
        `  <updated>${posts[0]?.date ?? new Date().toISOString()}</updated>`,
        '  <author><name>JetSquirrel</name><uri>https://github.com/JetSquirrel</uri></author>',
        `  <icon>${home}favicon.png</icon>`,
        ...entries,
        '</feed>',
        '',
      ].join('\n')
      await writeFile(resolve(config.outDir, feed.file), body)
    }
  },
})
