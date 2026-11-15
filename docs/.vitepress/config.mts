import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { defineConfig, type DefaultTheme, type HeadConfig } from 'vitepress'

// The app's repository: downloads, the GitHub link, and the code the pages
// describe. The pages themselves live in the site repository.
const repository = 'https://github.com/JetSquirrel/cloudbridge'
const siteRepository = 'https://github.com/JetSquirrel/cloudbridge-site'
// Where the docs are published — under /docs/ on the product page's domain —
// and the product page itself. Every absolute URL the pages hand to crawlers
// and link previews starts here.
const home = 'https://cloudbridge.jetsquirrel.cloud/'
const site = `${home}docs/`
const ogImage = `${site}og-image.png`
// Who wrote the pages and who publishes them, for the structured data.
const author = { '@type': 'Person', name: 'JetSquirrel', url: 'https://github.com/JetSquirrel' }
const publisher = {
  '@type': 'Organization',
  name: 'CloudBridge',
  url: home,
  logo: { '@type': 'ImageObject', url: `${home}assets/logo-160.png`, width: 160, height: 160 },
}

// The languages the docs are written in. `prefix` is the page folder under
// /docs/ (empty for English, at the root) and `lang` the value `lang`,
// `hreflang` and `inLanguage` take.
const languages = {
  en: { prefix: '', lang: 'en', ogLocale: 'en_US', label: 'English' },
  zh: { prefix: 'zh/', lang: 'zh-CN', ogLocale: 'zh_CN', label: '简体中文' },
  ja: { prefix: 'ja/', lang: 'ja', ogLocale: 'ja_JP', label: '日本語' },
  ko: { prefix: 'ko/', lang: 'ko', ogLocale: 'ko_KR', label: '한국어' },
  fr: { prefix: 'fr/', lang: 'fr', ogLocale: 'fr_FR', label: 'Français' },
} as const
type Lang = keyof typeof languages

// A page's path under the site root, as `cleanUrls` publishes it — the form
// Cloudflare serves without a redirect: `index.md` → ``,
// `zh/index.md` → `zh/`, `zh/alerts.md` → `zh/alerts`.
function pageUrl(relativePath: string): string {
  return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
}

// Which language a page belongs to, from the first folder of its path.
function pageLang(relativePath: string): Lang {
  const first = relativePath.split('/')[0]
  return (first in languages && first !== 'en' ? first : 'en') as Lang
}

// A page's Markdown as a reader outside the site sees it: the frontmatter
// becomes a title and a summary line, and root-relative links (VitePress
// resolves them against the base) get the full address, so the file still
// works when an AI assistant or a script fetches it on its own.
function standaloneMarkdown(source: string, url: string): string {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  const front = match?.[1] ?? ''
  let body = source.slice(match?.[0].length ?? 0).trim()
  const field = (name: string) => front.match(new RegExp(`^${name}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1]
  const title = field('title')
  const description = field('description')
  body = body.replace(/\]\(\/(?!\/)/g, `](${site}`)
  // The page's own heading stays first; the home layout has none, so its
  // title stands in.
  const heading = body.match(/^# .*\n/)?.[0]
  if (heading) body = body.slice(heading.length).trim()
  const lead = [
    heading?.trim() ?? `# ${title ?? 'CloudBridge'}`,
    description ? `> ${description}` : '',
    `Source: ${url}`,
  ].filter(Boolean).join('\n\n')
  return `${lead}\n\n${body}\n`
}

// The sidebar's wording in each language, in the order the pages appear.
const sidebarText: Record<Lang, { groups: string[]; pages: Record<string, string> }> = {
  en: {
    groups: ['Getting started', 'Connect your bills', 'Read the bill', 'Keep watch', 'Reference'],
    pages: {
      'getting-started': 'Install and first bill',
      'troubleshooting': 'Troubleshooting',
      aws: 'AWS',
      azure: 'Microsoft Azure',
      'google-cloud': 'Google Cloud',
      'alibaba-cloud': 'Alibaba Cloud',
      cloudflare: 'Cloudflare',
      deepseek: 'DeepSeek',
      'bill-import': 'Bill file import',
      permissions: 'Provider permissions',
      overview: 'Overview and accounts',
      attribution: 'Attribution',
      models: 'Models',
      insights: 'Insights',
      query: 'Query',
      alerts: 'Alerts, rules and budgets',
      background: 'Menu bar and background',
      'settings-and-data': 'Settings, data and security',
      focus: 'FOCUS and token data',
      shortcuts: 'Keyboard shortcuts',
    },
  },
  zh: {
    groups: ['入门', '连接账单', '读懂账单', '盯住花费', '参考'],
    pages: {
      'getting-started': '安装与第一份账单',
      'troubleshooting': '常见问题排查',
      aws: 'AWS',
      azure: 'Microsoft Azure',
      'google-cloud': 'Google Cloud',
      'alibaba-cloud': '阿里云',
      cloudflare: 'Cloudflare',
      deepseek: 'DeepSeek',
      'bill-import': '导入账单文件',
      permissions: '云平台权限',
      overview: '总览与账号',
      attribution: '成本归属',
      models: '模型',
      insights: '资源洞察',
      query: 'SQL 查询',
      alerts: '告警、规则与预算',
      background: '状态栏与后台运行',
      'settings-and-data': '设置、数据与安全',
      focus: 'FOCUS 与 token 数据',
      shortcuts: '键盘快捷键',
    },
  },
  ja: {
    groups: ['はじめに', '請求書をつなぐ', '請求書を読む', 'コストを見張る', 'リファレンス'],
    pages: {
      'getting-started': 'インストールと最初の請求書',
      'troubleshooting': 'トラブルシューティング',
      aws: 'AWS',
      azure: 'Microsoft Azure',
      'google-cloud': 'Google Cloud',
      'alibaba-cloud': 'Alibaba Cloud',
      cloudflare: 'Cloudflare',
      deepseek: 'DeepSeek',
      'bill-import': '請求ファイルのインポート',
      permissions: 'プロバイダーの権限',
      overview: '概要とアカウント',
      attribution: 'コスト配賦',
      models: 'モデル',
      insights: 'インサイト',
      query: 'クエリ',
      alerts: 'アラート・ルール・予算',
      background: 'メニューバーとバックグラウンド',
      'settings-and-data': '設定・データ・セキュリティ',
      focus: 'FOCUS とトークンデータ',
      shortcuts: 'キーボードショートカット',
    },
  },
  ko: {
    groups: ['시작하기', '청구서 연결', '청구서 읽기', '비용 지켜보기', '참고'],
    pages: {
      'getting-started': '설치와 첫 청구서',
      'troubleshooting': '문제 해결',
      aws: 'AWS',
      azure: 'Microsoft Azure',
      'google-cloud': 'Google Cloud',
      'alibaba-cloud': 'Alibaba Cloud',
      cloudflare: 'Cloudflare',
      deepseek: 'DeepSeek',
      'bill-import': '청구서 파일 가져오기',
      permissions: '공급자 권한',
      overview: '개요와 계정',
      attribution: '비용 귀속',
      models: '모델',
      insights: '인사이트',
      query: '쿼리',
      alerts: '알림, 규칙과 예산',
      background: '메뉴 막대와 백그라운드',
      'settings-and-data': '설정, 데이터와 보안',
      focus: 'FOCUS와 토큰 데이터',
      shortcuts: '키보드 단축키',
    },
  },
  fr: {
    groups: ['Pour commencer', 'Connecter vos factures', 'Lire la facture', 'Garder un œil', 'Référence'],
    pages: {
      'getting-started': 'Installation et première facture',
      'troubleshooting': 'Dépannage',
      aws: 'AWS',
      azure: 'Microsoft Azure',
      'google-cloud': 'Google Cloud',
      'alibaba-cloud': 'Alibaba Cloud',
      cloudflare: 'Cloudflare',
      deepseek: 'DeepSeek',
      'bill-import': 'Importer un fichier de facture',
      permissions: 'Autorisations des fournisseurs',
      overview: "Vue d'ensemble et comptes",
      attribution: 'Imputation',
      models: 'Modèles',
      insights: 'Analyses',
      query: 'Requête',
      alerts: 'Alertes, règles et budgets',
      background: 'Barre des menus et arrière-plan',
      'settings-and-data': 'Réglages, données et sécurité',
      focus: 'FOCUS et données de tokens',
      shortcuts: 'Raccourcis clavier',
    },
  },
}

function sidebar(lang: Lang): DefaultTheme.SidebarItem[] {
  const t = sidebarText[lang]
  const prefix = `/${languages[lang].prefix}`
  const item = (page: string) => ({ text: t.pages[page], link: `${prefix}${page}` })
  return [
    { text: t.groups[0], items: [item('getting-started'), item('troubleshooting')] },
    {
      text: t.groups[1],
      items: [
        item('aws'),
        item('azure'),
        item('google-cloud'),
        item('alibaba-cloud'),
        item('cloudflare'),
        item('deepseek'),
        item('bill-import'),
        item('permissions'),
      ],
    },
    {
      text: t.groups[2],
      items: [item('overview'), item('attribution'), item('models'), item('insights'), item('query')],
    },
    { text: t.groups[3], items: [item('alerts'), item('background')] },
    {
      text: t.groups[4],
      items: [item('settings-and-data'), item('focus'), item('shortcuts')],
    },
  ]
}

// The theme's own wording, for the languages that are not English.
const themeText: Record<Lang, {
  docs: string
  nav: [string, string, string, string, string]
  outline: string
  editLink: string
  lastUpdated: string
  prev: string
  next: string
  langMenu: string
  sidebarMenu: string
  returnToTop: string
  skipToContent: string
  appearance: string
  light: string
  dark: string
  notFound: { title: string; quote: string; linkLabel: string; linkText: string }
  footer: string
}> = {
  en: {
    docs: 'Docs',
    nav: ['Home', 'Get started', 'Demo', 'Blog', 'Download'],
    outline: 'On this page',
    editLink: 'Edit this page on GitHub',
    lastUpdated: 'Last updated',
    prev: 'Previous page',
    next: 'Next page',
    langMenu: 'Change language',
    sidebarMenu: 'Menu',
    returnToTop: 'Return to top',
    skipToContent: 'Skip to content',
    appearance: 'Appearance',
    light: 'Switch to light theme',
    dark: 'Switch to dark theme',
    notFound: {
      title: 'Page not found',
      quote: 'This page does not exist. Go back home or use the search to find a guide.',
      linkLabel: 'Go back home',
      linkText: 'Go back home',
    },
    footer: 'Released under the MIT License.',
  },
  zh: {
    docs: '文档',
    nav: ['官网', '快速上手', '在线演示', '博客', '下载'],
    outline: '本页目录',
    editLink: '在 GitHub 上编辑此页',
    lastUpdated: '最后更新',
    prev: '上一页',
    next: '下一页',
    langMenu: '切换语言',
    sidebarMenu: '目录',
    returnToTop: '返回顶部',
    skipToContent: '跳转到内容',
    appearance: '外观',
    light: '切换到浅色主题',
    dark: '切换到深色主题',
    notFound: {
      title: '页面未找到',
      quote: '这个页面不存在，请返回首页或使用搜索查找指南。',
      linkLabel: '返回首页',
      linkText: '返回首页',
    },
    footer: '基于 MIT 许可开源发布。',
  },
  ja: {
    docs: 'ドキュメント',
    nav: ['ホーム', 'はじめに', 'デモ', 'ブログ', 'ダウンロード'],
    outline: '本ページの目次',
    editLink: 'GitHub でこのページを編集',
    lastUpdated: '最終更新',
    prev: '前のページ',
    next: '次のページ',
    langMenu: '言語を切り替える',
    sidebarMenu: 'メニュー',
    returnToTop: 'トップへ戻る',
    skipToContent: 'コンテンツへスキップ',
    appearance: '外観',
    light: 'ライトテーマに切り替える',
    dark: 'ダークテーマに切り替える',
    notFound: {
      title: 'ページが見つかりません',
      quote: 'このページは存在しません。ホームに戻るか、検索でガイドを探してください。',
      linkLabel: 'ホームへ戻る',
      linkText: 'ホームへ戻る',
    },
    footer: 'MIT ライセンスで公開しています。',
  },
  ko: {
    docs: '문서',
    nav: ['홈', '시작하기', '데모', '블로그', '다운로드'],
    outline: '이 페이지 목차',
    editLink: 'GitHub에서 이 페이지 편집',
    lastUpdated: '마지막 업데이트',
    prev: '이전 페이지',
    next: '다음 페이지',
    langMenu: '언어 전환',
    sidebarMenu: '메뉴',
    returnToTop: '맨 위로',
    skipToContent: '콘텐츠로 건너뛰기',
    appearance: '테마',
    light: '라이트 테마로 전환',
    dark: '다크 테마로 전환',
    notFound: {
      title: '페이지를 찾을 수 없습니다',
      quote: '이 페이지는 존재하지 않습니다. 홈으로 돌아가거나 검색으로 가이드를 찾아보세요.',
      linkLabel: '홈으로 돌아가기',
      linkText: '홈으로 돌아가기',
    },
    footer: 'MIT 라이선스로 공개되었습니다.',
  },
  fr: {
    docs: 'Documentation',
    nav: ['Accueil', 'Pour commencer', 'Démo', 'Blog', 'Télécharger'],
    outline: 'Sur cette page',
    editLink: 'Modifier cette page sur GitHub',
    lastUpdated: 'Dernière mise à jour',
    prev: 'Page précédente',
    next: 'Page suivante',
    langMenu: 'Changer de langue',
    sidebarMenu: 'Menu',
    returnToTop: 'Retour en haut',
    skipToContent: 'Aller au contenu',
    appearance: 'Apparence',
    light: 'Passer au thème clair',
    dark: 'Passer au thème sombre',
    notFound: {
      title: 'Page introuvable',
      quote: "Cette page n'existe pas. Revenez à l'accueil ou utilisez la recherche pour trouver un guide.",
      linkLabel: "Retour à l'accueil",
      linkText: "Retour à l'accueil",
    },
    footer: 'Publié sous licence MIT.',
  },
}

// Each language's title and summary, which VitePress appends to every page's
// title and gives to the home page.
const docsTitles: Record<Lang, { title: string; description: string }> = {
  en: {
    title: 'CloudBridge Docs',
    description: 'Guides and reference for CloudBridge, the local-first desktop app that reads your cloud and AI bills into one ledger on your machine.',
  },
  zh: {
    title: 'CloudBridge 文档',
    description: '本地优先的云与 AI 账单桌面应用：把各家账单读进你电脑上的一本账。',
  },
  ja: {
    title: 'CloudBridge ドキュメント',
    description: 'ローカル優先のデスクトップアプリ CloudBridge のガイドとリファレンス。クラウドと AI の請求書を、お使いのパソコン上の一冊の台帳に読み込みます。',
  },
  ko: {
    title: 'CloudBridge 문서',
    description: '로컬 우선 데스크톱 앱 CloudBridge의 가이드와 참고 자료. 클라우드와 AI 청구서를 내 컴퓨터의 장부 하나로 읽어 들입니다.',
  },
  fr: {
    title: 'Documentation CloudBridge',
    description: "Guides et référence pour CloudBridge, l'application de bureau locale-first qui lit vos factures cloud et IA dans un registre unique, sur votre machine.",
  },
}

// What each language is called in its own language, for VitePress's locale
// menu and the hreflang links.
function localeConfig(lang: Lang) {
  const t = themeText[lang]
  const prefix = `/${languages[lang].prefix}`
  const nav = [
    { text: t.nav[0], link: `${home}${languages[lang].prefix}` },
    { text: t.nav[1], link: `${prefix}getting-started` },
    { text: t.nav[2], link: `${home}demo/` },
    { text: t.nav[3], link: `${home}blog/${languages[lang].prefix}` },
    { text: t.nav[4], link: `${repository}/releases/latest` },
  ]
  return {
    label: languages[lang].label,
    lang: languages[lang].lang,
    title: docsTitles[lang].title,
    description: docsTitles[lang].description,
    themeConfig: {
      nav,
      sidebar: sidebar(lang),
      outline: { label: t.outline, level: [2, 3] as [number, number] },
      editLink: { pattern: `${siteRepository}/edit/main/docs/:path`, text: t.editLink },
      lastUpdated: { text: t.lastUpdated },
      docFooter: { prev: t.prev, next: t.next },
      langMenuLabel: t.langMenu,
      sidebarMenuLabel: t.sidebarMenu,
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
  title: 'CloudBridge Docs',
  description: 'Guides and reference for CloudBridge, the local-first desktop app that reads your cloud and AI bills into one ledger on your machine.',
  base: '/docs/',
  // Beside the product page: scripts/build.sh copies home/ around this, and
  // one Worker serves the lot.
  outDir: '../dist/site/docs',
  // Cloudflare serves `page.html` at `/page` and redirects the former
  // to the latter; linking the clean form saves every reader that hop.
  cleanUrls: true,
  ignoreDeadLinks: false,
  // Per-page "last updated" dates, which also become the sitemap's lastmod.
  // Needs the full git history.
  lastUpdated: true,
  sitemap: { hostname: site },
  head: [
    // Head links are not given the base; the product page serves the icon.
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['meta', { name: 'theme-color', content: '#0e1420' }],
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large' }],
    ['meta', { property: 'og:site_name', content: 'CloudBridge' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '675' }],
    ['meta', { property: 'og:image:alt', content: 'The CloudBridge Overview: month-to-date spend across clouds and model providers, a daily spend chart and the biggest movers' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: ogImage }],
  ],
  // What differs page to page: its canonical address, its title and summary
  // for link previews, its other-language twins, and its structured data. The
  // blog is a site of its own, at /blog/ (blog/ in this repository).
  transformHead({ pageData, title, description }) {
    const path = pageUrl(pageData.relativePath)
    const lang = pageLang(pageData.relativePath)
    const prefix = languages[lang].prefix
    const rest = path.startsWith(prefix) ? path.slice(prefix.length) : path
    const url = `${site}${path}`
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:locale', content: languages[lang].ogLocale }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
    for (const language of Object.values(languages)) {
      head.push(['link', { rel: 'alternate', hreflang: language.lang, href: `${site}${language.prefix}${rest}` }])
    }
    head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: `${site}${rest}` }])
    // Structured data for search engines and AI answer engines: where the
    // page sits in the site, and — for every page but the landing ones —
    // that it is technical documentation about CloudBridge, and when it
    // last changed.
    const docsHome = `${site}${prefix}`
    const crumbs = [
      { name: 'CloudBridge', item: `${home}${prefix}` },
      { name: themeText[lang].docs, item: docsHome },
    ]
    if (url !== docsHome) crumbs.push({ name: pageData.title || title, item: url })
    const graph: object[] = [{
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
    }]
    if (url !== docsHome) {
      graph.push({
        '@type': 'TechArticle',
        headline: pageData.title || title,
        description,
        url,
        inLanguage: languages[lang].lang,
        ...(pageData.lastUpdated ? { dateModified: new Date(pageData.lastUpdated).toISOString() } : {}),
        image: ogImage,
        author,
        publisher,
        isPartOf: { '@type': 'WebSite', name: 'CloudBridge', url: home },
        about: { '@type': 'SoftwareApplication', name: 'CloudBridge', url: home },
        encoding: { '@type': 'MediaObject', encodingFormat: 'text/markdown', contentUrl: `${url}.md` },
      })
    }
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })])
    // The same page as plain Markdown (see buildEnd).
    head.push(['link', { rel: 'alternate', type: 'text/markdown', href: `${url.endsWith('/') ? `${url}index` : url}.md` }])
    return head
  },
  locales: {
    root: localeConfig('en'),
    zh: localeConfig('zh'),
    ja: localeConfig('ja'),
    ko: localeConfig('ko'),
    fr: localeConfig('fr'),
  },
  themeConfig: {
    logo: { src: '/assets/logo.png', alt: 'CloudBridge' },
    outline: { level: [2, 3] },
    editLink: { pattern: `${siteRepository}/edit/main/docs/:path` },
    socialLinks: [{ icon: 'github', link: repository }],
    footer: { message: 'Released under the MIT License.' },
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索文档' },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到相关结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: '回车键',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '向上箭头',
                  navigateDownKeyAriaLabel: '向下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc 键',
                },
              },
            },
          },
          ja: {
            translations: {
              button: { buttonText: '検索', buttonAriaLabel: 'ドキュメントを検索' },
              modal: {
                displayDetails: '詳細リストを表示',
                resetButtonTitle: '検索をクリア',
                backButtonTitle: '検索を閉じる',
                noResultsText: '一致する結果が見つかりません',
                footer: {
                  selectText: '選択',
                  selectKeyAriaLabel: 'Enter キー',
                  navigateText: '移動',
                  navigateUpKeyAriaLabel: '上矢印キー',
                  navigateDownKeyAriaLabel: '下矢印キー',
                  closeText: '閉じる',
                  closeKeyAriaLabel: 'Esc キー',
                },
              },
            },
          },
          ko: {
            translations: {
              button: { buttonText: '검색', buttonAriaLabel: '문서 검색' },
              modal: {
                displayDetails: '상세 목록 표시',
                resetButtonTitle: '검색 지우기',
                backButtonTitle: '검색 닫기',
                noResultsText: '일치하는 결과가 없습니다',
                footer: {
                  selectText: '선택',
                  selectKeyAriaLabel: 'Enter 키',
                  navigateText: '이동',
                  navigateUpKeyAriaLabel: '위쪽 화살표',
                  navigateDownKeyAriaLabel: '아래쪽 화살표',
                  closeText: '닫기',
                  closeKeyAriaLabel: 'Esc 키',
                },
              },
            },
          },
          fr: {
            translations: {
              button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher dans la documentation' },
              modal: {
                displayDetails: 'Afficher la liste détaillée',
                resetButtonTitle: 'Effacer la recherche',
                backButtonTitle: 'Fermer la recherche',
                noResultsText: 'Aucun résultat trouvé',
                footer: {
                  selectText: 'Sélectionner',
                  selectKeyAriaLabel: 'Touche Entrée',
                  navigateText: 'Naviguer',
                  navigateUpKeyAriaLabel: 'Flèche haut',
                  navigateDownKeyAriaLabel: 'Flèche bas',
                  closeText: 'Fermer',
                  closeKeyAriaLabel: 'Touche Échap',
                },
              },
            },
          },
        },
      },
    },
  },
  async buildEnd(config) {
    await copyFile(resolve(config.srcDir, 'assets/logo.png'), resolve(config.outDir, 'assets/logo.png'))
    // Every page again as Markdown beside its HTML — /docs/alerts.md next to
    // /docs/alerts — plus each language's pages in one file, llms-full.txt,
    // for AI assistants and anyone who wants the text without the site
    // (https://llmstxt.org). The product page's /llms.txt points here.
    const full: Record<Lang, string[]> = { en: [], zh: [], ja: [], ko: [], fr: [] }
    for (const page of [...config.pages].sort()) {
      const path = pageUrl(page)
      const markdown = standaloneMarkdown(await readFile(resolve(config.srcDir, page), 'utf8'), `${site}${path}`)
      const target = resolve(config.outDir, page)
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, markdown)
      full[pageLang(page)].push(markdown)
    }
    for (const lang of Object.keys(languages) as Lang[]) {
      await writeFile(resolve(config.outDir, `${languages[lang].prefix}llms-full.txt`), full[lang].join('\n---\n\n'))
    }
  },
})
