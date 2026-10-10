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

// A page's path under the site root, as `cleanUrls` publishes it — the form
// Cloudflare serves without a redirect: `index.md` → ``,
// `zh/index.md` → `zh/`, `zh/alerts.md` → `zh/alerts`.
function pageUrl(relativePath: string): string {
  return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
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

function sidebar(zh = false): DefaultTheme.SidebarItem[] {
  const prefix = zh ? '/zh/' : '/'
  const item = (page: string, english: string, chinese: string) => ({
    text: zh ? chinese : english,
    link: `${prefix}${page}`,
  })
  return [
    {
      text: zh ? '入门' : 'Getting started',
      items: [
        item('getting-started', 'Install and first bill', '安装与第一份账单'),
        item('troubleshooting', 'Troubleshooting', '常见问题排查'),
      ],
    },
    {
      text: zh ? '连接账单' : 'Connect your bills',
      items: [
        item('aws', 'AWS', 'AWS'),
        item('alibaba-cloud', 'Alibaba Cloud', '阿里云'),
        item('cloudflare', 'Cloudflare', 'Cloudflare'),
        item('deepseek', 'DeepSeek', 'DeepSeek'),
        item('bill-import', 'Bill file import', '导入账单文件'),
        item('permissions', 'Provider permissions', '云平台权限'),
      ],
    },
    {
      text: zh ? '读懂账单' : 'Read the bill',
      items: [
        item('overview', 'Overview and accounts', '总览与账号'),
        item('attribution', 'Attribution', '成本归属'),
        item('models', 'Models', '模型'),
        item('insights', 'Insights', '资源洞察'),
        item('query', 'Query', 'SQL 查询'),
      ],
    },
    {
      text: zh ? '盯住花费' : 'Keep watch',
      items: [
        item('alerts', 'Alerts, rules and budgets', '告警、规则与预算'),
        item('background', 'Menu bar and background', '状态栏与后台运行'),
      ],
    },
    {
      text: zh ? '参考' : 'Reference',
      items: [
        item('settings-and-data', 'Settings, data and security', '设置、数据与安全'),
        item('shortcuts', 'Keyboard shortcuts', '键盘快捷键'),
      ],
    },
    {
      text: zh ? '博客' : 'Blog',
      items: zh
        ? [
            { text: '中文文章', link: '/zh/blog/' },
            { text: '发布说明与设计（英文）', link: '/blog/' },
          ]
        : [{ text: 'Release notes and decisions', link: '/blog/' }],
    },
  ]
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
  // for link previews, and its other-language twin. A blog post is written
  // for one language — English under blog/, Chinese under zh/blog/ — and
  // has no twin.
  transformHead({ pageData, title, description }) {
    const path = pageUrl(pageData.relativePath)
    const url = `${site}${path}`
    const zh = pageData.relativePath.startsWith('zh/')
    const blog = /^(zh\/)?blog\//.test(pageData.relativePath)
    const english = zh ? path.replace(/^zh\//, '') : path
    const chinese = zh ? path : `zh/${path}`
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:locale', content: zh ? 'zh_CN' : 'en_US' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
    if (!blog) {
      head.push(
        ['link', { rel: 'alternate', hreflang: 'en', href: `${site}${english}` }],
        ['link', { rel: 'alternate', hreflang: 'zh-CN', href: `${site}${chinese}` }],
        ['link', { rel: 'alternate', hreflang: 'x-default', href: `${site}${english}` }],
      )
    }
    // Structured data for search engines and AI answer engines: where the
    // page sits in the site, and — for every page but the landing ones —
    // that it is technical documentation about CloudBridge, and when it
    // last changed.
    const docsHome = zh ? `${site}zh/` : site
    const crumbs = [
      { name: 'CloudBridge', item: zh ? `${home}zh/` : home },
      { name: zh ? '文档' : 'Docs', item: docsHome },
    ]
    if (url !== docsHome) crumbs.push({ name: title.replace(/ \| CloudBridge Docs$/, ''), item: url })
    const graph: object[] = [{
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })),
    }]
    if (url !== docsHome) {
      graph.push({
        '@type': blog ? 'BlogPosting' : 'TechArticle',
        headline: pageData.title || title,
        description,
        url,
        inLanguage: zh ? 'zh-CN' : 'en',
        ...(pageData.frontmatter.date ? { datePublished: new Date(pageData.frontmatter.date).toISOString() } : {}),
        ...(pageData.lastUpdated ? { dateModified: new Date(pageData.lastUpdated).toISOString() } : {}),
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
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: home },
          { text: 'Get started', link: '/getting-started' },
          { text: 'Demo', link: `${home}demo/` },
          { text: 'Blog', link: '/blog/' },
          { text: 'Download', link: `${repository}/releases/latest` },
        ],
        sidebar: sidebar(),
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      description: '本地优先的云与 AI 账单桌面应用：把各家账单读进你电脑上的一本账。',
      themeConfig: {
        nav: [
          { text: '官网', link: `${home}zh/` },
          { text: '快速上手', link: '/zh/getting-started' },
          { text: '在线演示', link: `${home}demo/` },
          { text: '博客', link: '/zh/blog/' },
          { text: '下载', link: `${repository}/releases/latest` },
        ],
        sidebar: sidebar(true),
        outline: { label: '本页目录', level: [2, 3] },
        editLink: { pattern: `${siteRepository}/edit/main/docs/:path`, text: '在 GitHub 上编辑此页' },
        lastUpdated: { text: '最后更新' },
        docFooter: { prev: '上一页', next: '下一页' },
        langMenuLabel: '切换语言',
        sidebarMenuLabel: '目录',
        returnToTopLabel: '返回顶部',
        skipToContentLabel: '跳转到内容',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色主题',
        darkModeSwitchTitle: '切换到深色主题',
        notFound: {
          title: '页面未找到',
          quote: '这个页面不存在，请返回首页或使用搜索查找指南。',
          linkLabel: '返回首页',
          linkText: '返回首页',
        },
        footer: { message: '基于 MIT 许可开源发布。' },
      },
    },
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
    const full: Record<'en' | 'zh', string[]> = { en: [], zh: [] }
    for (const page of [...config.pages].sort()) {
      const path = pageUrl(page)
      const markdown = standaloneMarkdown(await readFile(resolve(config.srcDir, page), 'utf8'), `${site}${path}`)
      const target = resolve(config.outDir, page)
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, markdown)
      full[page.startsWith('zh/') ? 'zh' : 'en'].push(markdown)
    }
    await writeFile(resolve(config.outDir, 'llms-full.txt'), full.en.join('\n---\n\n'))
    await writeFile(resolve(config.outDir, 'zh/llms-full.txt'), full.zh.join('\n---\n\n'))
  },
})
