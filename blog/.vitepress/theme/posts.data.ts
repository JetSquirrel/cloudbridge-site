import { createContentLoader } from 'vitepress'

// Every post, newest first, read from its frontmatter at build time, so a new
// post appears on its blog's front page without anyone editing a list.
export type PostLang = 'en' | 'zh' | 'ja' | 'ko' | 'fr'

export interface Post {
  url: string
  title: string
  description: string
  date: string
  tag: string
  lang: PostLang
}

declare const data: Post[]
export { data }

function postLang(url: string): PostLang {
  const first = url.split('/')[1]
  return first === 'zh' || first === 'ja' || first === 'ko' || first === 'fr' ? first : 'en'
}

export default createContentLoader(['*.md', 'zh/*.md', 'ja/*.md', 'ko/*.md', 'fr/*.md'], {
  transform(pages): Post[] {
    return pages
      .filter((page) => page.frontmatter.date)
      .map((page) => ({
        url: page.url,
        title: page.frontmatter.title,
        description: page.frontmatter.description,
        date: new Date(page.frontmatter.date).toISOString().slice(0, 10),
        tag: page.frontmatter.tag ?? '',
        lang: postLang(page.url),
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})
