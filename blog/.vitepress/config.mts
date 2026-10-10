import { defineConfig, type HeadConfig } from 'vitepress'

// The blog, at /blog/ beside the product page and the docs rather than inside
// the docs: posts read without the docs' sidebar and outline, and the list is
// a page of its own. English posts at the root, Chinese ones under zh/; a
// post is written for one language and has no twin in the other.
const repository = 'https://github.com/JetSquirrel/cloudbridge'
const siteRepository = 'https://github.com/JetSquirrel/cloudbridge-site'
const home = 'https://cloudbridge.jetsquirrel.cloud/'
const site = `${home}blog/`
const docs = `${home}docs/`
const ogImage = `${docs}og-image.png`

// A page's path under the blog, as `cleanUrls` publishes it.
function pageUrl(relativePath: string): string {
  return relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
}

export default defineConfig({
  title: 'CloudBridge Blog',
  description: 'Release notes, decisions and field notes from CloudBridge, the local-first desktop app for cloud and AI bills.',
  base: '/blog/',
  // Beside the docs in the one site scripts/build.sh assembles.
  outDir: '../dist/site/blog',
  cleanUrls: true,
  ignoreDeadLinks: false,
  sitemap: { hostname: site },
  head: [
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
    const url = `${site}${path}`
    const zh = pageData.relativePath.startsWith('zh/')
    const post = Boolean(pageData.frontmatter.date)
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: post ? 'article' : 'website' }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:locale', content: zh ? 'zh_CN' : 'en_US' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
    if (post) {
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: pageData.title || title,
        description,
        url,
        inLanguage: zh ? 'zh-CN' : 'en',
        datePublished: new Date(pageData.frontmatter.date).toISOString(),
        isPartOf: { '@type': 'Blog', name: 'CloudBridge Blog', url: site },
        about: { '@type': 'SoftwareApplication', name: 'CloudBridge', url: home },
      })])
    }
    return head
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Home', link: home },
          { text: 'Docs', link: docs },
          { text: 'Blog', link: '/' },
          { text: 'Demo', link: `${home}demo/` },
          { text: 'Download', link: `${repository}/releases/latest` },
        ],
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'CloudBridge 博客',
      description: 'CloudBridge 的中文文章：怎么用好它，以及它为什么这样设计。',
      themeConfig: {
        nav: [
          { text: '官网', link: `${home}zh/` },
          { text: '文档', link: `${docs}zh/` },
          { text: '博客', link: '/zh/' },
          { text: '在线演示', link: `${home}demo/` },
          { text: '下载', link: `${repository}/releases/latest` },
        ],
        editLink: { pattern: `${siteRepository}/edit/main/blog/:path`, text: '在 GitHub 上编辑此页' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        langMenuLabel: '切换语言',
        returnToTopLabel: '返回顶部',
        skipToContentLabel: '跳转到内容',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色主题',
        darkModeSwitchTitle: '切换到深色主题',
        notFound: {
          title: '页面未找到',
          quote: '这篇文章不存在，回博客首页看看其他文章吧。',
          linkLabel: '返回博客首页',
          linkText: '返回博客首页',
        },
        footer: { message: '基于 MIT 许可开源发布。' },
      },
    },
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
})
